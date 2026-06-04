# Backend TODO

> NestJS + TypeORM backend for a game store. Most SQL functions will be replaced with TypeORM repository logic. Triggers and schema stay mostly intact.

---

## Table of Contents

1. [Database / Schema Changes](#1-database--schema-changes)
2. [Triggers to Keep](#2-triggers-to-keep)
3. [Modules to Create](#3-modules-to-create)
4. [Endpoints](#4-endpoints)
5. [Services / Business Logic](#5-services--business-logic)
6. [Guards, Decorators & Middleware](#6-guards-decorators--middleware)
7. [DTOs & Entities](#7-dtos--entities)
8. [Misc / Infrastructure](#8-misc--infrastructure)

---

## 1. Database / Schema Changes

- [ ] Rename camelCase tmp-function table/column aliases to match actual snake_case schema columns (the tmp SQL files reference `"User"`, `"Game"`, `"CartGame"` etc. — these need to align with the real table names `users`, `games`, `carts_games`)
- [ ] Decide on and document final table naming convention (snake_case confirmed from `01_tables.sql`)
- [ ] Drop all `tmp/03_func_*.sql` functions (replacing with TypeORM)
- [ ] Drop `tmp/04_proc_purchasing.sql` procedures (replacing with TypeORM + service logic)
- [ ] Keep and finalize `tmp/02_triggers.sql` (see section 2)
- [ ] Fix `stocks` trigger for `UPDATE` — current condition `OLD.is_sold IS NULL` is wrong; replace with `OLD.is_sold = FALSE AND NEW.is_sold = TRUE`
- [ ] Change `users.password` from `CHAR(60)` to `VARCHAR(255)` — bcrypt fits in 60 chars but Argon2 does not; future-proof it now before data exists
- [ ] Add `refresh_token_hash CHAR(64)` and `expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days'` columns to `sessions` table (required for refresh token architecture)
- [ ] Soft-delete stocks instead of hard-delete: add `is_archived BOOLEAN DEFAULT FALSE` to `stocks`, add FK `purchases.product_key → stocks.product_key ON DELETE RESTRICT`, never hard-delete stock rows (they are financial records)
- [ ] Fix `purchases.discount_applied`: rename to `discount_id`, change type to `BIGINT`, add `FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE SET NULL`
- [ ] Remove `games.quantity` denormalized column — derive from `COUNT(stocks WHERE is_sold = FALSE AND is_archived = FALSE)` at query time, or keep but add a periodic reconciliation job and fix the trigger bug first
- [ ] Add rate limiting to auth endpoints — install `@nestjs/throttler` and apply to `/auth/login`, `/auth/register`, `/auth/password-reset/request`
- [ ] Document the `discounts.condition` JSONB schema (e.g. `{ min_order_amount?: number, min_quantity?: number }`) and enforce it in the DTO layer

---

## 3. Modules to Create

### To create
- [ ] `CartModule`
- [ ] `WishlistModule`
- [ ] `ReviewsModule`
- [ ] `PurchasesModule` (owned games)
- [ ] `StocksModule` (admin)
- [ ] `DiscountsModule` (admin)
- [ ] `TicketsModule`
- [ ] `SearchModule` (or integrate into `GamesModule`)
- [ ] `PaymentModule` (Stripe integration via `payment_methods` table)
- [ ] `BundlesModule` (optional / later)

---

## 4. Endpoints

### Search — `/api/search`

| Status | Method | Path | Description |
|--------|--------|------|-------------|
| [ ] todo | GET | `/api/search` | Advanced search with filters (term, price, genre, platform, metacritic, coming_soon, sort, page) |
| [ ] todo | GET | `/api/search/count` | Count results for a search query (for pagination) |

---

### Reviews — `/api/reviews`

| Status | Method | Path | Description |
|--------|--------|------|-------------|
| [ ] todo | POST | `/api/reviews` | Create review (must own game) |
| [ ] todo | PATCH | `/api/reviews/:id` | Update own review |
| [ ] todo | DELETE | `/api/reviews/:id` | Delete own review |
| [ ] todo | POST | `/api/reviews/:id/vote` | Vote helpful/not-helpful |
| [ ] todo | DELETE | `/api/reviews/:id/vote` | Remove vote |

---

### Purchase / Checkout — `/api/checkout`

| Status | Method | Path | Description |
|--------|--------|------|-------------|
| [ ] todo | POST | `/api/checkout/reserve` | Reserve cart for purchase (checks stock, adjusts quantities) |
| [ ] todo | POST | `/api/checkout/confirm` | Complete purchase (grant keys, mark stock sold) |
| [ ] todo | POST | `/api/checkout/cancel` | Cancel pending reservation |

---

### Tickets — `/api/tickets`

| Status | Method | Path | Description |
|--------|--------|------|-------------|
| [ ] todo | POST | `/api/tickets` | Submit a support ticket (works for guests too) |
| [ ] todo | GET | `/api/tickets/:id` | Get ticket by ID (owner or employee) |
| [ ] todo | PATCH | `/api/tickets/:id/status` | Update ticket status (employee only) |
| [ ] todo | GET | `/api/tickets` | List all tickets (admin/employee only) |

---

### Stocks — `/api/stocks` (admin)

| Status | Method | Path | Description |
|--------|--------|------|-------------|
| [ ] todo | GET | `/api/stocks/:gameId` | Get available stock count for a game |
| [ ] todo | POST | `/api/stocks` | Add product keys to stock |
| [ ] todo | DELETE | `/api/stocks/:productKey` | Remove a product key |

---

### Discounts — `/api/discounts` (admin)

| Status | Method | Path | Description |
|--------|--------|------|-------------|
| [ ] todo | GET | `/api/discounts` | List all discounts |
| [ ] todo | POST | `/api/discounts` | Create a discount |
| [ ] todo | PATCH | `/api/discounts/:id` | Update a discount |
| [ ] todo | DELETE | `/api/discounts/:id` | Delete a discount |
| [ ] todo | POST | `/api/discounts/:id/games/:gameId` | Assign discount to a game |
| [ ] todo | DELETE | `/api/discounts/:id/games/:gameId` | Remove discount from a game |


---

### Bundles — `/api/bundles` (optional / later)

| Status | Method | Path | Description |
|--------|--------|------|-------------|
| [ ] todo | GET | `/api/bundles` | List bundles |
| [ ] todo | GET | `/api/bundles/:id` | Get bundle details |
| [ ] todo | POST | `/api/bundles` | Create bundle (admin) |
| [ ] todo | PATCH | `/api/bundles/:id` | Update bundle (admin) |
| [ ] todo | DELETE | `/api/bundles/:id` | Delete bundle (admin) |

---

## 5. Services / Business Logic

### AuthService
- [ ] `requestPasswordReset(email)` — create ticket with reset link
- [ ] `confirmPasswordReset(ticketId, newPassword)` — validate ticket, update password

### SearchService
- [ ] `search(filters, pagination)` — filter by term, price range, genre[], platform[], developer[], publisher[], metacritic, coming_soon; sort by name/price/releaseDate/metacritic
- [ ] `count(filters)` — same filters without pagination, returns total count

### CartService
- [ ] `getCart(cartId)` — return cart with game details
- [ ] `addToCart(cartId, gameId, quantity)` — upsert `carts_games`
- [ ] `setQuantity(cartId, gameId, quantity)` — update or delete if 0
- [ ] `removeFromCart(cartId, gameId)` — delete row
- [ ] `computeTotal(cartId)` — sum `games.price * quantity` for each item (apply discounts when implemented)

### WishlistService
- [ ] `getWishlist(userId)` — return wishlist with game info
- [ ] `addToWishlist(userId, gameId)` — insert, handle already-exists
- [ ] `removeFromWishlist(userId, gameId)` — delete
- [ ] `isInWishlist(userId, gameId)` — boolean check

### ReviewsService
- [ ] `createReview(userId, gameId, rating, content)` — verify user owns game first
- [ ] `updateReview(reviewId, userId, rating, content)` — verify ownership
- [ ] `deleteReview(reviewId, userId)` — verify ownership
- [ ] `getGameReviews(gameId)` — list reviews with user info
- [ ] `getUserReviews(userId, gameId?)` — optional filter by game
- [ ] `voteReview(userId, reviewId, isHelpful)` — upsert `review_votes`
- [ ] `removeVote(userId, reviewId)` — delete from `review_votes`

### PurchasesService (owned games)
- [ ] `getLibrary(userId, page, limit)` — list purchases with game info
- [ ] `getPurchase(userId, purchaseId)` — single purchase detail
- [ ] `getProductKey(userId, purchaseId)` — return `product_key`
- [ ] `ownsGame(userId, gameId)` — boolean check (used by ReviewsService)

### CheckoutService
- [ ] `reserveCart(cartId)` — mirror `reserve_cart_for_purchase` procedure logic in TypeScript:
  - check cart exists and not reserved
  - for each item, count unsold stock; remove/reduce if insufficient
  - if modified, return early with flag and new total
  - otherwise update cart `is_reserved = true, transaction_status = 'pending'` (trigger deducts quantities)
- [ ] `completePurchase(userId, cartId, paymentMethodId?)` — mirror `complete_purchase_transaction`:
  - validate cart is reserved + pending
  - for each item, lock unsold stock rows (FOR UPDATE SKIP LOCKED)
  - insert `purchases` rows
  - mark `stocks.is_sold = true`
  - update cart `transaction_status = 'completed'`, clear `carts_games`, unreserve
- [ ] `cancelReservation(cartId)` — unreserve cart (trigger restores quantities)
- [ ] `cleanupExpiredReservations(timeoutMinutes)` — scheduled job, cancel all carts reserved > N minutes ago

### StocksService (admin)
- [ ] `getStockCount(gameId)` — count unsold keys
- [ ] `addKeys(gameId, keys[])` — bulk insert into `stocks`
- [ ] `removeKey(productKey)` — delete

### DiscountsService (admin)
- [ ] `findAll()` — list all discounts
- [ ] `create(dto)` — insert discount
- [ ] `update(id, dto)` — partial update
- [ ] `remove(id)` — delete
- [ ] `assignToGame(discountId, gameId, scope)` — insert `games_discounts`
- [ ] `removeFromGame(discountId, gameId)` — delete
- [ ] `computeEffectivePrice(gameId, discountId?)` — replicate `GetEffectivePrice` logic in TS

### TicketsService
- [ ] `create(dto)` — insert ticket (trigger auto-links user by email)
- [ ] `findOne(ticketId, requesterId)` — return ticket if owner or employee
- [ ] `updateStatus(ticketId, status)` — employee only
- [ ] `findAll(filters)` — employee/admin only

---

## 6. Guards, Decorators & Middleware

- [ ] `EmployeeGuard` — check `employees` table + `permission_level >= 1`
- [ ] `AdminGuard` — check `permission_level >= 4` (or chosen threshold)
- [ ] `@CurrentUser()` decorator — already partially exists (`user.decorator.ts`), verify it exposes `id`, `cart_id`, and `sessionId` (from JWT payload `sid` claim)
- [ ] IP / UA / country extraction middleware — extract from request headers on each authenticated call, pass to `SessionService.updateMetadata()`
- [ ] Rate limiting — apply `@Throttle()` from `@nestjs/throttler` on `/auth/login`, `/auth/register`, `/auth/password-reset/request`

---

## 7. DTOs & Entities

### Entities to create (TypeORM)

- [ ] `Bundle` entity + `BundleGame` junction
- [ ] `Discount` entity
- [ ] `GameDiscount` entity
- [ ] `Cart` entity
- [ ] `CartGame` entity
- [ ] `Stock` entity
- [ ] `Purchase` entity
- [ ] `PaymentMethod` entity
- [ ] `SavedPaymentMethod` entity
- [ ] `Wishlist` entity
- [ ] `Review` entity
- [ ] `ReviewVote` entity
- [ ] `Ticket` entity
- [ ] `Employee` entity

### DTOs to create

**Auth**
- [ ] `PasswordResetRequestDto` (email)
- [ ] `PasswordResetConfirmDto` (ticketId, newPassword)

**JWT Payload interface** (not a DTO but define it as a typed interface):
```ts
interface JwtPayload {
  sub: string;    // userId
  sid: string;    // sessionId
  iat: number;
  exp: number;
}
```

**User**
- [ ] `UpdateUserDto` — extend existing (bio, country, billing_address, newsletter_subscription, birthday_date, first_name, last_name)

**Cart**
- [ ] `AddToCartDto` (gameId, quantity)
- [ ] `SetCartQuantityDto` (quantity)

**Reviews**
- [ ] `CreateReviewDto` (gameId, rating, content?)
- [ ] `UpdateReviewDto` (rating, content?)
- [ ] `VoteReviewDto` (isHelpful: boolean)

**Search**
- [ ] `SearchQueryDto` (term, minPrice, maxPrice, categoryIds[], genreIds[], platformIds[], developerIds[], publisherIds[], minMetacritic, comingSoon, sortBy, sortOrder, page, limit)

**Checkout**
- [ ] `ConfirmPurchaseDto` (paymentMethodId?)

**Tickets**
- [ ] `CreateTicketDto` (email, reason, content)
- [ ] `UpdateTicketStatusDto` (status: 'Open' | 'Resolved' | 'Closed')

**Discounts**
- [ ] `CreateDiscountDto` (code?, amount, type, condition?, target, expirationDate)
- [ ] `AssignDiscountDto` (scope: 'public' | 'private')

**Stocks**
- [ ] `AddStockDto` (gameId, keys: string[])

---

## 8. Misc / Infrastructure

- [ ] **Scheduled jobs** — install `@nestjs/schedule`, create a `TasksModule` with:
  - `CleanupExpiredReservations` — every 5 minutes, cancel carts reserved > 15 min ago
  - `CleanupOldSessions` — daily, delete sessions where `expires_at < NOW()`
- [ ] **Swagger / OpenAPI** — wire up all new controllers to the existing doc structure in `src/docs/`
- [ ] **Pagination** — extend `PaginatedDto` for use across all list endpoints
- [ ] **Error handling** — standardize HTTP error responses (404, 403, 409 conflict for duplicate reviews, etc.)
- [ ] **Payment integration** — Stripe: create payment intent, save `pm_*` IDs into `payment_methods`, link to `saved_payment_methods`
- [ ] **Upload — avatar filename** — replace `avatar-{userId}-{timestamp}` pattern with `avatar-{randomUUID()}` to avoid leaking userId in publicly accessible URLs
- [ ] **Upload — add WebP support** — add `image/webp` to the MIME filter in `upload.constants.ts`
- [ ] **Upload — image resizing** — install `sharp`, resize avatar to max 512×512 before saving to disk; prevents image-bomb attacks and reduces storage
- [ ] **Upload — file deletion reliability** — replace fire-and-forget `unlink` callback with a proper async/await + structured error logging in `UploadService.removeObsoleteFile()`
- [ ] **Upload — storage** — local disk (`./uploads/avatars`) does not survive redeployment without a Docker volume mount; configure a named volume in `docker-compose.yml`, or migrate to S3/MinIO for production
- [ ] **Environment config** — ensure all secrets (JWT secret, DB creds, Stripe key) are in `.env` and validated at startup with `@nestjs/config` + Joi schema
- [ ] **Rate limiting** — install `@nestjs/throttler`, apply globally with stricter limits on auth routes
- [ ] **Unit tests** — `.spec.ts` files exist for some modules; fill out tests for all services
- [ ] **E2E tests** — cover the main purchase flow end-to-end