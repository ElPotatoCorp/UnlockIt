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

- [ ] Fix `stocks` trigger for `UPDATE` — current condition `OLD.is_sold IS NULL` is wrong; replace with `OLD.is_sold = FALSE AND NEW.is_sold = TRUE`
- [ ] Soft-delete stocks instead of hard-delete: add `is_archived BOOLEAN DEFAULT FALSE` to `stocks`, add FK `purchases.product_key → stocks.product_key ON DELETE RESTRICT`, never hard-delete stock rows (they are financial records)
- [ ] Fix `purchases.discount_applied`: rename to `discount_id`, change type to `BIGINT`, add `FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE SET NULL`
- [ ] Remove `games.quantity` denormalized column — derive from `COUNT(stocks WHERE is_sold = FALSE AND is_archived = FALSE)` at query time, or keep but add a periodic reconciliation job and fix the trigger bug first
- [ ] Add rate limiting to auth endpoints — install `@nestjs/throttler` and apply to `/auth/login`, `/auth/register`, `/auth/password-reset/request`
- [ ] Document the `discounts.condition` JSONB schema (e.g. `{ min_order_amount?: number, min_quantity?: number }`) and enforce it in the DTO layer

---

## 3. Modules to Create

### To create
- [ ] `ReviewsModule`
- [ ] `PurchasesModule` (owned games)
- [ ] `StocksModule` (admin)
- [ ] `DiscountsModule` (admin)
- [ ] `TicketsModule`
- [ ] `PaymentModule` (Stripe integration via `payment_methods` table)
- [ ] `BundlesModule` (optional / later)

---

## 4. Endpoints

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
- [ ] `count(filters)` — same filters without pagination, returns total count

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
- [ ] `Review` entity
- [ ] `ReviewVote` entity
- [ ] `Ticket` entity
- [ ] `Employee` entity

### DTOs to create

**Auth**
- [ ] `PasswordResetRequestDto` (email)
- [ ] `PasswordResetConfirmDto` (ticketId, newPassword)

**Cart**
- [ ] `AddToCartDto` (gameId, quantity)
- [ ] `SetCartQuantityDto` (quantity)

**Reviews**
- [ ] `CreateReviewDto` (gameId, rating, content?)
- [ ] `UpdateReviewDto` (rating, content?)
- [ ] `VoteReviewDto` (isHelpful: boolean)

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
- [ ] **Error handling** — standardize HTTP error responses (404, 403, 409 conflict for duplicate reviews, etc.)
- [ ] **Payment integration** — Stripe: create payment intent, save `pm_*` IDs into `payment_methods`, link to `saved_payment_methods`
- [ ] **Upload — avatar filename** — replace `avatar-{userId}-{timestamp}` pattern with `avatar-{randomUUID()}` to avoid leaking userId in publicly accessible URLs
- [ ] **Upload — image resizing** — install `sharp`, resize avatar to max 512×512 before saving to disk; prevents image-bomb attacks and reduces storage
- [ ] **Upload — file deletion reliability** — replace fire-and-forget `unlink` callback with a proper async/await + structured error logging in `UploadService.removeObsoleteFile()`
- [ ] **Environment config** — ensure all secrets (JWT secret, DB creds, Stripe key) are in `.env` and validated at startup with `@nestjs/config` + Joi schema
- [ ] **Unit tests** — `.spec.ts` files exist for some modules; fill out tests for all services
- [ ] **E2E tests** — cover the main purchase flow end-to-end