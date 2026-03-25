# Scenario Design Guide

How to design **integration/functional scenario tests** that validate whole user flows. Use this as a TDD base when defining scenarios.

---

## 1. Scenario vs Unit Test

| Aspect | Scenario Test | Unit Test |
|--------|---------------|-----------|
| Scope | End-to-end user flow | Single function/class |
| Dependencies | Real API, DB, or test doubles | Mocks/stubs |
| Order | **Strict** — steps depend on previous | Independent |
| Goal | Business flow works | Logic is correct |

---

## 2. Order and Dependencies

### Rule: Define steps in the order a user would perform them.

**Example: CRUD — Create before Read**

```
1. CREATE  → get id
2. READ    → use id from step 1
3. UPDATE  → use id from step 1
4. DELETE  → use id from step 1
```

Wrong order (e.g., READ before CREATE) makes no sense for a new object.

### Example: Marketplace Flow

```
1. List products     → get product_ids
2. Get product      → use product_id
3. Add to cart      → get cart_id
4. Apply coupon     → optional, needs cart_id
5. Checkout         → needs cart_id, payment method
6. Pay              → needs order_id from checkout
7. Verify payment   → confirm order status
```

---

## 3. Example Scenarios

### A. Marketplace

| Step | Action | Input | Output | Notes |
|------|--------|-------|--------|-------|
| 1 | List products | `GET /products` | list of products | Filter by category if needed |
| 2 | Get product detail | `GET /products/{id}` | product | Use id from step 1 |
| 3 | Add to cart | `POST /cart/items` | cart_id, item_id | User must be logged in |
| 4 | Get cart | `GET /cart` | cart with items | Validate items before pay |
| 5 | Checkout | `POST /checkout` | order_id | Creates order, pending payment |
| 6 | Pay | `POST /orders/{id}/pay` | payment_id | Payment gateway call |
| 7 | Verify | `GET /orders/{id}` | status=paid | Confirm order completed |

**Error scenarios:** Invalid product, empty cart, payment declined, insufficient stock.

---

### B. CRUD (Generic Object)

| Step | Action | Order | Notes |
|------|--------|-------|-------|
| 1 | CREATE | First | Returns id; needed for R, U, D |
| 2 | READ | After Create | Verify created data |
| 3 | UPDATE | After Read | Change one or more fields |
| 4 | READ again | After Update | Verify update persisted |
| 5 | DELETE | Last | Clean up |

**Object-specific order:** Some entities depend on others. Example:

- **User + Profile:** Create User → Create Profile (user_id) → Read both → Update Profile → Delete Profile → Delete User.

---

### C. Auth Flow

| Step | Action | Notes |
|------|--------|-------|
| 1 | Register | Get user_id |
| 2 | Login | Get token |
| 3 | Access protected resource | Use token |
| 4 | Logout | Invalidate token |
| 5 | Access protected resource (should fail) | Expect 401 |

---

## 4. Shared State Between Steps

Use a context object (dict, map) to pass data between steps:

```python
context = {}
# Step 1
products = api.get("/products")
context["product_id"] = products[0]["id"]

# Step 2
cart = api.post("/cart/items", {"product_id": context["product_id"]})
context["cart_id"] = cart["id"]

# Step 3
order = api.post("/checkout", {"cart_id": context["cart_id"]})
context["order_id"] = order["id"]
```

---

## 5. Idempotency and Cleanup

- Use **unique IDs** (UUID, timestamp) for entities created in tests.
- **Teardown:** Delete in reverse order of creation (e.g., delete cart before product if needed).
- **Isolation:** Each scenario can use a fresh user/session to avoid collisions.

---

## 6. What to Assert

| Step | Assert |
|------|--------|
| List/Get | Status 200, non-empty list/object, required fields present |
| Create | Status 201, id returned, data matches input |
| Update | Status 200, persisted data matches |
| Delete | Status 204 or 200, subsequent GET returns 404 |
| Pay | Status 200, order status = paid |
| Verify | Status 200, payment_id present, amounts correct |

---

## 7. HTML Report Checklist

Ensure the test runner produces:

- [ ] Scenario name
- [ ] Step name and order
- [ ] Pass/fail per step
- [ ] Duration
- [ ] Error message and stack trace on failure
- [ ] Optional: request/response summary for debugging
