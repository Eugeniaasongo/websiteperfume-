# Ghanaian E-Commerce Perfume Brand - Architecture & Operations

## 1. System Architecture Overview

The system is built on Next.js 14 (App Router) using React, TypeScript, Tailwind CSS, Prisma ORM, and SQLite / PostgreSQL.

```
+-----------------------------------------------------------------------+
|                            NEXT.JS APP ROUTER                         |
|  +---------------------+  +---------------------+  +----------------+ |
|  | Storefront Pages    |  | Cart Context & UI   |  | Admin Portal   | |
|  | (PDP, Catalog, Search)| | (Drawer, Checkout)  |  | (RBAC, Audit)  | |
|  +----------+----------+  +----------+----------+  +-------+--------+ |
|             |                        |                      |         |
|             +------------------------+----------------------+         |
|                                      |                                |
|                           SERVER API ROUTE HANDLERS                   |
|                  (/api/checkout, /api/search, /api/webhooks)          |
+----------------------------------+------------------------------------+
                                   |
                  +----------------+----------------+
                  |                                 |
         +--------v--------+               +--------v--------+
         | Prisma DB Layer |               | Payment Adapters|
         | (SQLite/Postgres)|               | (Paystack / COD)|
         +-----------------+               +-----------------+
```

## 2. Payment & Webhook Processing Flow

1. **Checkout Initiation:** Server re-computes subtotal, discounts, and delivery fees. Reserves inventory stock with 20-minute TTL.
2. **Gateway Dispatch:** Paystack initialized via HMAC signed request; or COD initialized with zone validity check.
3. **Webhook Receiver (`/api/webhooks/paystack`):** Verifies HMAC SHA512 signature, logs event for idempotency (`WebhookEvent`), updates order state via `OrderStateMachine` to `PAID`, and logs payment transaction.

## 3. Operations Runbook

### Key Key Management & Rotation
- Set `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY` in environment.
- Never hardcode gateway keys in codebase or client bundles.

### Replaying Webhooks
- Webhooks logged in `WebhookEvent` table can be inspected in the database and reprocessed safely due to idempotency key check.

### Admin User Management
- Admin access protected by RBAC check and 2FA simulation layer.
