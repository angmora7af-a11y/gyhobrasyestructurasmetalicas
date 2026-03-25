# Design System Document: G&H Obras Industrial Interface

## 1. Overview & Creative North Star: "The Industrial Ledger"
The Creative North Star for this design system is **"The Industrial Ledger."** In the world of heavy equipment and B2B logistics, clarity is safety. We are moving away from the "software-as-a-service" template look and toward a high-end, editorialized industrial aesthetic. 

This system breaks the "generic grid" by utilizing high-contrast typography and **Tonal Layering** rather than borders. The interface should feel like a precision-engineered tool: heavy where it needs to be (Deep Charcoal surfaces), urgent where it matters (Corporate Red accents), and hyper-functional in its data density. By prioritizing typographic hierarchy over imagery, we create a sophisticated, "Blue-Chip" professional atmosphere.

---

## 2. Colors & Surface Architecture

### The Palette
We utilize a high-contrast palette that mirrors industrial environments—safety reds, high-visibility greens, and structural grays.

*   **Primary (`primary` / #b5000b):** Used for critical actions and brand presence.
*   **Tertiary/Accent (`tertiary` / #4b6000):** Our "Neon Green" high-visibility token. Use this sparingly for "Live" statuses or critical data points that require immediate ocular tracking.
*   **Neutral Hierarchy:** 
    *   `surface`: #f9f9f9 (The base canvas)
    *   `on-surface`: #1a1c1c (Primary text and icons)
    *   `surface-container-highest`: #e2e2e2 (The deepest "recessed" level)

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or table rows. Boundaries must be created via background shifts.
*   *Instead of a border:* Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f3f3f3) background.
*   *Result:* The eye perceives the edge through the shift in value, creating a cleaner, more premium look.

### The "Glass & Gradient" Rule
To prevent the "Industrial" look from feeling "Old," use glassmorphism for floating elements (like dropdown menus or active tooltips). 
*   **Implementation:** Use `surface` colors at 85% opacity with a `20px` backdrop blur. 
*   **Signature Textures:** For KPI cards or primary buttons, use a subtle linear gradient from `primary` (#b5000b) to `primary-container` (#e30613). This adds "soul" and depth to flat industrial UI.

---

## 3. Typography: The Editorial Engine
Since this system forbids images in the catalog, typography carries the visual weight. We use **Montserrat** (via the `display` and `headline` tokens) for an authoritative, geometric feel, and **Roboto** (via the `body` tokens) for maximum legibility in data-dense environments.

*   **Display & Headline (Montserrat):** These should be tracked slightly tighter (-2%) to feel like high-end architectural signage. Use `headline-lg` for inventory categories to command attention.
*   **Body & Labels (Roboto/Inter):** The workhorse. In data-dense tables, use `body-sm` (0.75rem) to maximize information density without sacrificing clarity.
*   **Contrast as Navigation:** Use `on-surface-variant` for metadata and `on-surface` for primary data. The shift in "ink weight" replaces the need for dividers.

---

## 4. Elevation & Depth: Tonal Layering
We reject the standard Material Design drop shadow. Depth in this design system is achieved through **Stacking Tiers.**

1.  **Level 0 (The Floor):** `surface` (#f9f9f9).
2.  **Level 1 (The Content Area):** `surface-container-low` (#f3f3f3).
3.  **Level 2 (The Interactive Card):** `surface-container-lowest` (#ffffff).
4.  **Level 3 (The Floating State):** Use a "Ghost Border"—the `outline-variant` token at 15% opacity—combined with an **Ambient Shadow** (Blur: 32px, Opacity: 4%, Color: `on-surface`).

This creates a "nested" look where the UI feels like a series of interlocking, precision-cut plates.

---

## 5. Components

### Fixed Vertical Sidebar
*   **Surface:** `inverse-surface` (#2f3131).
*   **Active State:** No "pills." Use a high-contrast `primary` vertical bar (4px width) on the left edge and shift the active text to `primary-fixed`.
*   **Typography:** Montserrat `label-md` for uppercase navigation items.

### Data-Dense Tables
*   **Header:** `surface-container-high`. No borders. Use `title-sm` (Montserrat) for column titles.
*   **Rows:** Alternate between `surface` and `surface-container-low`. 
*   **Spacing:** Use Spacing Scale `2` (0.4rem) for vertical cell padding to maintain density while ensuring the "No-Line" rule remains legible.

### Status Badges (The "Hi-Vis" System)
*   **Draft:** `secondary-container` with `on-secondary-container`.
*   **Pending:** `outline` text with no background.
*   **In Process:** `primary-container` background with `on-primary` text.
*   **Closed/Complete:** `tertiary-fixed` (#c3f400) background with `on-tertiary-fixed` (#161e00) text. (The "Neon Green" signals safety/completion).

### KPI Cards
*   **Structure:** No borders. Use `surface-container-lowest` with a subtle 4px `primary` top-border accent.
*   **Data:** Large `display-sm` numbers in Montserrat to make metrics the hero of the dashboard.

### Input Fields
*   **State:** Default fields use `surface-variant`. On focus, transition to `surface-container-lowest` with a 2px `primary` bottom-bar. Avoid the four-sided box; the bottom-bar mimics industrial blueprints.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use vertical white space (Spacing Scale `6` or `8`) to separate major content blocks.
*   **Do** use Montserrat Bold for numerical data in tables; it makes the figures feel "heavy" and reliable.
*   **Do** embrace asymmetry. A sidebar can be narrow while the content area is expansive, with "hanging" headlines that bleed into the margins.

### Don't
*   **Don’t use divider lines.** If you feel the need for a line, increase the background color contrast between the two sections instead.
*   **Don’t use standard drop shadows.** They look "cheap" in a B2B context. Use tonal shifts or ambient, low-opacity blurs.
*   **Don’t use imagery.** Rely on the `surface-tint` and typography to provide the brand’s visual "flavor."