# Backend TODO

> NestJS + TypeORM backend for a game store. Most SQL functions will be replaced with TypeORM repository logic. Triggers and schema stay mostly intact.

---

## 3. Modules to Create

### To create
- [ ] `ReviewsModule`

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

## 5. Services / Business Logic

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

---

## 7. DTOs & Entities

### Entities to create (TypeORM)

- [ ] `Review` entity
- [ ] `ReviewVote` entity

### DTOs to create

**Reviews**
- [ ] `CreateReviewDto` (gameId, rating, content?)
- [ ] `UpdateReviewDto` (rating, content?)
- [ ] `VoteReviewDto` (isHelpful: boolean)

---

## 8. Misc / Infrastructure

- [ ] **Scheduled jobs** — install `@nestjs/schedule`, create a `TasksModule` with:
  - `CleanupExpiredReservations` — every 5 minutes, cancel carts reserved > 15 min ago
  - `CleanupOldSessions` — daily, delete sessions where `expires_at < NOW()`
- [ ] **Swagger / OpenAPI** — wire up all new controllers to the existing doc structure in `src/docs/`
- [ ] **Upload — image resizing** — install `sharp`, resize avatar to max 512×512 before saving to disk; prevents image-bomb attacks and reduces storage
- [ ] **Upload — file deletion reliability** — replace fire-and-forget `unlink` callback with a proper async/await + structured error logging in `UploadService.removeObsoleteFile()`
- [ ] **Unit tests** — `.spec.ts` files exist for some modules; fill out tests for all services
- [ ] **E2E tests** — cover the main purchase flow end-to-end