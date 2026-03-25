# Scenario Testing — Base Template

**Purpose:** Integration and functional scenario tests that validate **whole user flows**, not unit tests. Acts as a TDD base for building end-to-end behavior.

---

## What This Is

| Scenario Tests | Unit Tests |
|----------------|------------|
| Whole user flows (e.g., browse → add to cart → pay → verify) | Single function/class in isolation |
| Backend + API (or full stack) | Mocks for dependencies |
| Order matters (CRUD: create before read; pay before verify) | Independent, order-agnostic |
| Real or test DB, real HTTP calls | No side effects |
| Output: HTML report | Usually console or coverage report |

---

## Folder Structure

```
tests/
├── README.md                 # This file
├── SCENARIO-DESIGN.md        # How to design scenarios
├── scenarios/                 # Scenario definitions (agnostic)
│   ├── marketplace.yaml
│   └── crud-order.yaml
├── python/                    # Pytest implementation
│   ├── conftest.py
│   ├── base_scenario.py
│   ├── test_marketplace.py
│   ├── test_crud_order.py
│   ├── pytest.ini
│   └── requirements-test.txt
├── node/                      # Jest/Vitest (optional)
│   └── README.md
└── reports/                   # HTML output (gitignored)
    └── .gitkeep
```

---

## Quick Start

### Python (pytest)

```bash
# Ensure your API is running (e.g. http://localhost:8000)
cd tests/python
pip install -r requirements-test.txt
pytest -v --html=../reports/report.html --self-contained-html
open ../reports/report.html   # or xdg-open on Linux
```

### Node — see `node/README.md`

```bash
cd tests/node
npm install
npm run test:scenarios
```

---

## Scenario Design Rules

1. **Order matters:** Define steps in the exact user/business order (e.g., create product before buying it).
2. **Full flow:** Cover happy path and key error paths (e.g., pay with invalid card).
3. **Shared state:** Scenarios can depend on previous steps (e.g., `cart_id` from add-to-cart used in checkout).
4. **Idempotency:** Where possible, use unique IDs so reruns don't conflict.

See `SCENARIO-DESIGN.md` for detailed examples (marketplace, CRUD).

---

## HTML Report

After running tests, open `tests/reports/report.html`. The report includes:

- Pass/fail per scenario and step
- Duration
- Error details and stack traces

---

## Adding New Scenarios

1. Define the flow in `scenarios/<name>.yaml` (optional, for documentation).
2. Implement in `python/test_<name>.py` or `node/<name>.test.js`.
3. Follow the order defined in `SCENARIO-DESIGN.md` for your domain.
