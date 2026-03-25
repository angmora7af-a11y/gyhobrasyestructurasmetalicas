# SOLID Principles — Quick Reference for Agents

A concise guide for applying SOLID when writing or refactoring code. Use this when implementing features or fixing errors.

---

## S — Single Responsibility Principle (SRP)

**Rule:** A class/module should have only one reason to change.

| Do | Avoid |
|----|-------|
| Separate validation, persistence, and presentation | One class that validates, saves, and renders |
| One use-case per file (e.g. `LoginUser.ts`) | Monolithic handlers with multiple responsibilities |

```typescript
// ✅ SRP: separate concerns
class LoginValidator { validate(email, password) { /* ... */ } }
class LoginUseCase { execute(credentials) { /* call repo */ } }
class AuthController { handle(req) { /* validate → use-case → response */ } }

// ❌ SRP violated: controller does validation + persistence + response
class AuthController {
  handle(req) {
    if (!this.isValid(req.body)) throw ...;
    const user = await this.db.findUser(req.body.email);
    return res.json({ token: this.jwt.sign(user) });
  }
}
```

---

## O — Open/Closed Principle (OCP)

**Rule:** Open for extension, closed for modification. Add behavior without changing existing code.

| Do | Avoid |
|----|-------|
| Use interfaces/abstractions; inject implementations | Switch/if-else for new behavior |
| Strategy, Factory, Plugin patterns | Modifying core logic for each new case |

```typescript
// ✅ OCP: new payment method = new class, no change to processor
interface PaymentMethod { charge(amount: number): Promise<void>; }
class StripePayment implements PaymentMethod { charge(amount) { /* ... */ } }
class WompiPayment implements PaymentMethod { charge(amount) { /* ... */ } }
class OrderProcessor { constructor(private payment: PaymentMethod) {} process(order) { this.payment.charge(order.total); } }

// ❌ OCP violated: adding PayPal requires editing OrderProcessor
class OrderProcessor {
  process(order, method: 'stripe' | 'wompi') {
    if (method === 'stripe') { /* ... */ }
    else if (method === 'wompi') { /* ... */ }
  }
}
```

---

## L — Liskov Substitution Principle (LSP)

**Rule:** Subtypes must be substitutable for their base type without breaking behavior.

| Do | Avoid |
|----|-------|
| Same contract (inputs/outputs, exceptions) in subtypes | Subtypes that throw unexpected exceptions or change semantics |
| Covariant returns, invariant preconditions | Weakening preconditions or strengthening postconditions |

```typescript
// ✅ LSP: ReadOnlyUserRepo respects UserRepository contract
interface UserRepository { findById(id: string): Promise<User | null>; }
class PostgresUserRepo implements UserRepository { findById(id) { /* ... */ } }
class ReadOnlyUserRepo implements UserRepository { findById(id) { /* no writes */ } }

// ❌ LSP violated: subtype throws where base returns null
class FailingUserRepo implements UserRepository {
  findById(id: string) { throw new Error('Not supported'); } // Base expects null, not throw
}
```

---

## I — Interface Segregation Principle (ISP)

**Rule:** Clients should not depend on interfaces they do not use. Prefer small, focused interfaces.

| Do | Avoid |
|----|-------|
| `IReadUser`, `IWriteUser` instead of one `IUserRepository` with 20 methods | Fat interfaces; classes implementing unused methods as no-op |
| Compose interfaces when needed | One interface for everything |

```typescript
// ✅ ISP: client depends only on what it needs
interface UserReader { findById(id: string): Promise<User | null>; }
interface UserWriter { save(user: User): Promise<void>; }
class LoginUseCase { constructor(private reader: UserReader) {} }  // only needs read

// ❌ ISP violated: LoginUseCase forced to depend on save, delete, etc.
interface UserRepository { findById(); save(); delete(); findByEmail(); updatePassword(); ... }
```

---

## D — Dependency Inversion Principle (DIP)

**Rule:** Depend on abstractions, not concretions. High-level modules should not depend on low-level modules.

| Do | Avoid |
|----|-------|
| Use-case depends on `UserRepository` interface; infra implements it | Use-case imports PostgresUserRepo directly |
| Inject dependencies via constructor | `new PostgresRepo()` inside use-case |

```typescript
// ✅ DIP: use-case depends on abstraction
class LoginUseCase {
  constructor(private userRepo: UserRepository) {}  // interface in domain
  async execute(creds: Credentials) {
    const user = await this.userRepo.findByEmail(creds.email);
    // ...
  }
}
// infrastructure implements UserRepository

// ❌ DIP violated: use-case imports concrete DB
import { PostgresUserRepo } from '../infrastructure/postgres';
class LoginUseCase {
  private repo = new PostgresUserRepo();  // tightly coupled
}
```

---

## Redirect for Agents

When implementing features or fixing bugs, always:

1. **Before coding:** Check if the change respects SRP (one responsibility per module).
2. **When adding behavior:** Prefer extension (OCP) over modification.
3. **When implementing interfaces:** Ensure substitutability (LSP).
4. **When defining contracts:** Use small interfaces (ISP).
5. **When wiring dependencies:** Inject abstractions, not concretions (DIP).

Reference: `templates/architecture-patterns.md` for layer boundaries and Clean Architecture.
