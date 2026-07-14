# Shri Ram — Order System: Complete Detailed Specification

---

## SECTION 1: Bulk Order / Function Booking

**Visibility:** Permanent — always visible on the website, no ON/OFF toggle.

### Form Fields:
1. **Name** — text input
2. **Phone Number** — text input
3. **Which Function** — dropdown/text (Wedding, Birthday, Corporate Event, Other)
4. **Avg Glass Count** — number input
5. **Date** — date picker with dynamic minimum-date logic:
   - Default (page load / glass count empty): minimum **1 day advance**
   - If glass count is entered and is **≥ 500**: minimum automatically updates to **2 days advance**
   - If user then reduces glass count back below 500: minimum reverts to 1 day advance
6. **Item** — text area / multi-select (which flavors/items needed)
7. **Location** — text area (address)
8. **Description** — text area (optional notes)

### Submit Flow:
- Customer clicks Submit
- Data is sent **silently in the background** (no page reload, no redirect) via a **Google Apps Script Web App** to a **Google Sheet**, which acts as the database/order log
- Customer immediately sees a confirmation message on the same page:
  > **"✅ Thank you! Our team will contact you soon."**
- Shop owner receives a notification (via Apps Script trigger — WhatsApp/Email/SMS) so they can follow up quickly
- No Google Form UI, no redirect, no visible Google branding — form is fully custom-styled to match the site (glass-morphism, brand red `#c6121b`, brand green `#4cb745`)

---

## SECTION 2: Instant/Ready Order ("Right Now Craving")

**Visibility:** Base section (call/WhatsApp + pickup info) is always visible. The **delivery feature within this section** is controlled by an ON/OFF toggle (see Delivery Toggle System below).

### Step 1 — Location Gate (Delivery Check)
- A **"Check Delivery"** button/prompt appears first
- On click, requests the customer's browser GPS location
- Calculates straight-line distance to the shop's fixed coordinates using the **Haversine formula** (pure JS, no paid API)
- Logic:
  - **Within 2km** (practical safety cutoff ~1.7–1.8km to account for GPS vs. road distance) → unlocks the order form below
  - **Beyond 2km** → form stays hidden/disabled; show "Outside delivery zone. Pickup only available at our store."
- If location permission is denied → fallback to a manual address text field, with a note that delivery availability will be manually confirmed by the shop
- Requires HTTPS to function (Geolocation API restriction)

### Step 2 — Order Form (Unlocked only after successful 2km check)

**Menu/Item Selection — Cart-Style UI:**
- Items are grouped into **category accordions** (collapsible sections), matching the shop's 9 menu categories:
  1. Lemon Soda (લીબુ સોડા)
  2. Flavored Soda (ફ્લેવર્સ સોડા)
  3. Coffee (કોફી) — has Regular / Ice Cream variants
  4. Varieties (વેરાયટીઝ)
  5. Mojito (મોજિટો)
  6. Lassi (લસ્સી)
  7. Coco (કોકો)
  8. Milk Cold Drinks (દુધ કોલ્ડ્રીકસ) — has Regular / Ocho Barf / Special variants
  9. Kesh Sarbat (કશ સરબતો) — has Soda / Dudh variants
- Each item shows: name, price(s) per variant, and a **"+ Add"** button
- If item has variants → small selector (dropdown/radio) appears to choose variant before adding
- Quantity selector (+/- buttons, default 1) per item
- **Floating/sticky Cart Summary** (bottom or side panel):
  - Real-time list of selected items (e.g., "Mint Mojito x2, Cold Coffee (Ice Cream) x1")
  - Remove option per item
  - Running item count
- Below cart: **Name** and **Phone Number** fields

### Submit Flow:
- Customer clicks Submit
- **Two things happen simultaneously:**
  1. A **WhatsApp deep link** (`wa.me`) opens with a pre-filled, formatted message containing: customer name, phone number, **delivery location (from GPS)**, and the full cart (items + variants + quantities). Customer presses "Send" in WhatsApp to confirm.
  2. The same order data is **silently saved in parallel** to the Google Sheet (same backend as Bulk Order), so every order is logged even before WhatsApp confirmation.
- Shop owner receives the order on WhatsApp directly and can respond to confirm and coordinate delivery/pickup.

---

## Delivery Toggle System (Controls Section 2's Delivery Feature Only)

- A **Google Sheet** with a single cell holding `ON` or `OFF`, published to web as CSV
- On page load, JavaScript fetches this CSV and reads the value:
  - **OFF** → Delivery/location-check UI in Section 2 is hidden; only pickup messaging shown
  - **ON** → Delivery/location-check UI is shown and functional
- The website's HTML structure never changes — only the visibility of this specific delivery feature toggles dynamically (`display: none` / `display: block`), with no redeploy needed
- This toggle does **not** affect Section 1 (Bulk Order), which remains permanently visible regardless of toggle state

---

## Styling Requirements (Both Sections)

- Glass-morphism panels
- Brand colors: red `#c6121b`, green `#4cb745`
- Consistent with existing hero section (video background, glass-morphism USP panel)
- Fully mobile-responsive (most customers will use phones)

---

## Deliverables Needed From Shop Owner (Vansh)

- [ ] Confirmed WhatsApp Business number
- [ ] Shop's exact address + Google Maps location link (or lat/long coordinates)
- [ ] Shop timings
- [ ] Full menu with item names, categories, variants, and prices (as per uploaded menu card — 9 categories, 60+ items)
- [ ] 11 bestseller item names + real photos
- [ ] Google Sheet set up for Bulk Order log (with Apps Script Web App URL for silent submission)
- [ ] Google Sheet set up for Instant Order log (can be same sheet, different tab)
- [ ] Google Sheet with single ON/OFF cell for delivery toggle, published as CSV
- [ ] Notification preference for new orders (WhatsApp/Email/SMS) for Apps Script trigger
