-- ================================
-- | PURCHASE PROCEDURES          |
-- ================================

/**
 * Reserve a cart and its items for purchase
 * 
 * This procedure:
 * 1. Validates cart exists and isn't already reserved
 * 2. Checks game availability for all cart items
 * 3. Adjusts quantities if needed (removes unavailable, reduces over-requested)
 * 4. Reserves the cart (triggers will deduct quantities)
 * 
 * Returns:
 * - success: BOOLEAN
 * - message: TEXT
 * - cart_modified: BOOLEAN
 * - total_price: NUMERIC
 */
CREATE OR REPLACE FUNCTION reserve_cart_for_purchase(
   p_cart_id UUID
)
RETURNS TABLE(
   success BOOLEAN,
   message TEXT,
   cart_modified BOOLEAN,
   total_price NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
   v_is_reserved BOOLEAN;
   v_modified BOOLEAN := FALSE;
   v_total NUMERIC := 0;
   v_item RECORD;
   v_available INT;
BEGIN
   -- Check if cart exists and is not already reserved
   SELECT is_reserved INTO v_is_reserved
   FROM cart
   WHERE id = p_cart_id;
   
   IF NOT FOUND THEN
      RETURN QUERY SELECT FALSE, 'Cart not found'::TEXT, FALSE, 0::NUMERIC;
      RETURN;
   END IF;
   
   IF v_is_reserved THEN
      RETURN QUERY SELECT FALSE, 'Cart is already reserved'::TEXT, FALSE, 0::NUMERIC;
      RETURN;
   END IF;
   
   -- Check availability and adjust quantities for each cart item
   FOR v_item IN 
      SELECT cg.game_id, cg.quantity, g.price
      FROM cart_game cg
      JOIN game g ON cg.game_id = g.id
      WHERE cg.cart_id = p_cart_id
   LOOP
      -- Get available quantity for this game
      SELECT COALESCE(COUNT(*), 0) INTO v_available
      FROM stock
      WHERE game_id = v_item.game_id
      AND is_sold = FALSE;
      
      IF v_available <= 0 THEN
         -- Remove item from cart if not available
         DELETE FROM cart_game
         WHERE cart_id = p_cart_id
         AND game_id = v_item.game_id;
         
         v_modified := TRUE;
      ELSIF v_available < v_item.quantity THEN
         -- Reduce quantity if insufficient stock
         UPDATE cart_game
         SET quantity = v_available
         WHERE cart_id = p_cart_id
         AND game_id = v_item.game_id;
         
         v_modified := TRUE;
         v_total := v_total + (v_available * v_item.price);
      ELSE
         -- Add to total if quantity is ok
         v_total := v_total + (v_item.quantity * v_item.price);
      END IF;
   END LOOP;
   
   -- If cart was modified, return early for user confirmation
   IF v_modified THEN
      RETURN QUERY SELECT FALSE, 'Cart quantities adjusted due to limited stock'::TEXT, TRUE, v_total;
      RETURN;
   END IF;
   
   -- Check if cart is empty after adjustments
   IF NOT EXISTS (SELECT 1 FROM cart_game WHERE cart_id = p_cart_id) THEN
      RETURN QUERY SELECT FALSE, 'Cart is empty or all items unavailable'::TEXT, TRUE, 0::NUMERIC;
      RETURN;
   END IF;
   
   -- Reserve the cart (triggers will handle quantity deduction)
   UPDATE cart
   SET is_reserved = TRUE,
       transaction_status = 'pending',
       reserved_at = NOW()
   WHERE id = p_cart_id;
   
   RETURN QUERY SELECT TRUE, 'Cart reserved successfully'::TEXT, FALSE, v_total;
END;
$$;


/**
 * Complete a purchase transaction
 * 
 * This procedure:
 * 1. Validates cart is reserved with pending status
 * 2. Grants game keys to user
 * 3. Creates purchase records
 * 4. Marks stock as sold
 * 5. Updates cart status to completed
 * 6. Clears cart items
 * 
 * Returns array of purchase records created
 */
CREATE OR REPLACE FUNCTION complete_purchase_transaction(
   p_customer_id UUID,
   p_cart_id UUID,
   p_payment_method_id VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE(
   purchase_id UUID,
   game_id BIGINT,
   "product_key" VARCHAR(50),
   effective_price NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
   v_is_reserved BOOLEAN;
   v_transaction_status VARCHAR(20);
   v_item RECORD;
   v_assigned RECORD;
   v_unit_price NUMERIC;
   v_purchase_id UUID;
BEGIN
   -- Validate cart is reserved and pending
   SELECT is_reserved, transaction_status
   INTO v_is_reserved, v_transaction_status
   FROM cart
   WHERE id = p_cart_id;
   
   IF NOT FOUND THEN
      RAISE EXCEPTION 'Cart not found';
   END IF;
   
   IF NOT v_is_reserved OR v_transaction_status != 'pending' THEN
      RAISE EXCEPTION 'Cart is not in a valid state for purchase completion';
   END IF;
   
   -- Process each cart item
   FOR v_item IN
      SELECT cg.game_id, cg.quantity
      FROM cart_game cg
      WHERE cg.cart_id = p_cart_id
   LOOP
      -- Get unit price
      SELECT get_effective_price(v_item.game_id, NULL::BIGINT)
      INTO v_unit_price;
      
      -- Grant games and get assigned keys
      FOR v_assigned IN
         SELECT s.product_key
         FROM stock s
         WHERE s.game_id = v_item.game_id
           AND s.is_sold = FALSE
         LIMIT v_item.quantity
         FOR UPDATE SKIP LOCKED
      LOOP
         -- Create purchase record
         INSERT INTO purchase (
            user_id,
            product_key,
            game_id,
            effective_price,
            discount_applied,
            payment_method_id
         )
         VALUES (
            p_customer_id,
            v_assigned.product_key,
            v_item.game_id,
            v_unit_price,
            NULL,
            p_payment_method_id
         )
         RETURNING id INTO v_purchase_id;
         
         -- Mark stock as sold
         UPDATE stock s
         SET is_sold = TRUE
         WHERE s.product_key = v_assigned.product_key;
         
         -- Return purchase info
         RETURN QUERY SELECT 
            v_purchase_id,
            v_item.game_id,
            v_assigned.product_key,
            v_unit_price;
      END LOOP;
   END LOOP;
   
   -- Update cart status to completed
   UPDATE cart
   SET transaction_status = 'completed'
   WHERE id = p_cart_id;
   
   -- Clear cart items
   DELETE FROM cart_game
   WHERE cart_id = p_cart_id;
   
   -- Unreserve cart
   UPDATE cart
   SET is_reserved = FALSE
   WHERE id = p_cart_id;
END;
$$;


/**
 * Cancel a pending purchase reservation
 * 
 * This procedure:
 * 1. Validates cart is reserved with pending status
 * 2. Unreserves cart (triggers will restore quantities)
 * 3. Clears transaction status
 */
CREATE OR REPLACE FUNCTION cancel_purchase_reservation(
   p_cart_id UUID
)
RETURNS TABLE(
   success BOOLEAN,
   message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
   v_is_reserved BOOLEAN;
   v_transaction_status VARCHAR(20);
BEGIN
   -- Validate cart state
   SELECT is_reserved, transaction_status
   INTO v_is_reserved, v_transaction_status
   FROM cart
   WHERE id = p_cart_id;
   
   IF NOT FOUND THEN
      RETURN QUERY SELECT FALSE, 'Cart not found'::TEXT;
      RETURN;
   END IF;
   
   IF NOT v_is_reserved THEN
      RETURN QUERY SELECT FALSE, 'Cart is not reserved'::TEXT;
      RETURN;
   END IF;
   
   IF v_transaction_status = 'completed' THEN
      RETURN QUERY SELECT FALSE, 'Cannot cancel a completed transaction'::TEXT;
      RETURN;
   END IF;
   
   -- Unreserve cart (triggers will restore quantities)
   UPDATE cart
   SET is_reserved = FALSE,
       transaction_status = NULL,
       reserved_at = NULL
   WHERE id = p_cart_id;
   
   RETURN QUERY SELECT TRUE, 'Reservation cancelled successfully'::TEXT;
END;
$$;


/**
 * Clean up expired cart reservations
 * 
 * This procedure finds and cancels all cart reservations that have been
 * pending for more than the specified timeout period (default 15 minutes)
 * 
 * Returns number of reservations cancelled
 */
CREATE OR REPLACE FUNCTION cleanup_expired_reservations(
   p_timeout_minutes INT DEFAULT 15
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
   v_count INT := 0;
   v_cart_id UUID;
BEGIN
   FOR v_cart_id IN
      SELECT id
      FROM cart
      WHERE is_reserved = TRUE
      AND transaction_status = 'pending'
      AND reserved_at < NOW() - (p_timeout_minutes || ' minutes')::INTERVAL
   LOOP
      PERFORM cancel_purchase_reservation(v_cart_id);
      v_count := v_count + 1;
   END LOOP;
   
   RETURN v_count;
END;
$$;
