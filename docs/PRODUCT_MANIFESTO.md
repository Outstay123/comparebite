# 📘 CompareBite Product Manifesto + Function Guide
## For Kai Jing — Product Designer

**Version:** 1.0  
**Date:** May 2026  
**Status:** MANDATORY

---

# 🎯 PRODUCT OVERVIEW

## What is CompareBite?

**CompareBite is a decision platform that helps users compare food and drinks across sellers to find the best value, while helping sellers improve their products.**

### Core Promise to Users:
- **Consumers:** "Find the best value meal in seconds"
- **Sellers:** "Understand how to improve your products"

### Target Users:
1. **Students** — Budget-conscious, want best value
2. **Everyday consumers** — Busy, want quick decisions
3. **Small F&B sellers** — Need insights, not complex analytics

---

## Core User Flows

### Consumer Flow:
```
Search → Compare → Decide → Save Money
```

### Seller Flow:
```
View Product → Analyze → Adjust → Improve
```

---

# 🔹 PART 1: GLOBAL DESIGN PHILOSOPHY

## 1. Clarity Over Creativity

**What it means:** Users must understand instantly. Clever design that confuses is bad design.

**Why it matters for CompareBite:**
- Users are hungry and in a hurry
- Every second of confusion = lost user
- Food decisions shouldn't require learning an interface

**Execution:**
- Labels must be self-explanatory
- Icons must be obvious (no abstract symbols)
- Layout must follow expected patterns (search at top, filters on left)

**Example:**
- ✅ "Search food and drinks" (clear)
- ❌ "Explore culinary options" (vague, requires thinking)

---

## 2. Speed Over Complexity

**What it means:** The fastest path to value is the best path. Remove friction.

**Why it matters for CompareBite:**
- Users want to compare NOW, not after 5 steps
- Every extra click = drop-off
- Comparison should feel instant, not like a workflow

**Execution:**
- Search → Results in < 2 seconds
- Compare → Side-by-side immediately
- No multi-step wizards for simple actions

**Example:**
- ✅ Compare page loads two products instantly side-by-side
- ❌ Compare requires selecting Product A, then Product B, then clicking "Compare"

---

## 3. Decision-First UI

**What it means:** Every screen must help the user make a decision. Information that doesn't help decide is noise.

**Why it matters for CompareBite:**
- The entire app is about making a choice (which food to buy)
- Information overload paralyzes decision-making
- Users need clear winners, not equal options

**Execution:**
- Highlight the best option clearly
- Show savings/premium clearly
- Use badges (Best Value, Save RM5) to guide decisions

**Example:**
- ✅ "Save RM3.50" badge in green, prominent
- ❌ Two products shown equally with no indication which is better

---

## 4. Minimal Friction

**What it means:** Remove everything that slows the user down without adding value.

**Why it matters for CompareBite:**
- Students decide on food during short breaks
- Extra steps = abandonment
- Simple beats comprehensive

**Execution:**
- One-tap filters
- No account required for basic features
- Smart defaults (auto-sort by Best Value)

**Example:**
- ✅ Tap "Chicken Chop" filter → Results update instantly
- ❌ Open filter panel → Scroll → Check box → Click Apply → Wait

---

## 5. Consistency

**What it means:** Same patterns everywhere. User learns once, applies everywhere.

**Why it matters for CompareBite:**
- Users navigate multiple pages (search, compare, seller dashboard)
- Inconsistency feels unprofessional and confusing
- Speed requires predictable patterns

**Execution:**
- Same product card design everywhere
- Same button styles everywhere
- Same color meanings everywhere (green = good value, red = overpriced)

**Example:**
- ✅ Product card on Search looks identical to Product card on Seller Dashboard
- ❌ Different card styles on every page

---

# 🔹 PART 2: FULL FEATURE BREAKDOWN

---

## 1. HOMEPAGE

### 1.1 Purpose
The homepage is the **entry point and first impression**. It must immediately communicate what CompareBite does and get users to search or compare within 5 seconds.

**Problem it solves:**
- User doesn't know where to start
- User wants to see what the app can do
- User wants to start comparing immediately

### 1.2 User Flow
```
1. User lands on homepage
2. User sees search bar (immediate focus)
3. User either:
   a) Types in search bar
   b) Clicks suggested category
   c) Clicks compare teaser
4. User is taken to results/compare page
```

### 1.3 Key Data / Logic
- **Search bar:** Empty initially, placeholder text suggests action
- **Suggested categories:** Popular searches (Chicken Chop, Burger, Nasi Lemak)
- **Compare teaser:** Shows a real comparison example (e.g., McD vs KFC)
- **Recent searches:** (If returning user) Quick access to past searches

### 1.4 UI Requirements

**Hero Section:**
- Search bar is **60% of visual attention**
- Search bar: Large (56px height), centered, full-width max 600px
- Placeholder: "Search food, drinks, or sellers..."
- Background: Clean white or very light gray
- Headline above search: "Find the best value food near you" (bold, 24px)

**Compare Teaser:**
- Positioned below search
- Shows two real products side-by-side
- Clear "VS" indicator between them
- "See more comparisons" link below
- Purpose: Show users what comparison looks like

**Promo Cards (3 max):**
- Horizontal row of 3 cards
- Icons: Lucide, 32px
- Labels: "Best Value", "Save Money", "Seller Insights"
- Simple, no descriptions (just titles)
- Background: Light tinted colors

**Category Pills:**
- Below promo cards
- Horizontal scrollable row
- Pills: Rounded-full, gray background
- Examples: "Chicken Chop", "Burger", "Coffee", "Nasi Lemak"
- Purpose: One-tap entry to popular searches

### 1.5 Common Mistakes

❌ **Cluttered hero** — Too many elements above fold distract from search  
❌ **Small search bar** — Makes it feel unimportant  
❌ **No suggested actions** — User doesn't know what to search for  
❌ **Decorative illustrations** — Waste space, don't help decision  
❌ **Multiple CTAs** — "Search" AND "Compare" AND "Explore" AND "Learn More" — confusing  

✅ **Fix:** One primary action (Search), two secondary (Compare teaser, Category pills)

---

## 2. SEARCH PAGE

### 2.1 Purpose
The search page is the **discovery engine**. Users find products that match their criteria, filtered and sorted to show best value first.

**Problem it solves:**
- "I want chicken chop under RM15 near me"
- "Show me only highly-rated items"
- "I only want to see local sellers, not chains"

### 2.2 User Flow
```
1. User enters search term or clicks category
2. Page loads with:
   - Left panel: Filters
   - Right panel: Results
3. User can:
   a) Apply filters (category, price, rating, seller type)
   b) Sort results (Best Value, Price Low-High, Rating)
   c) Click product to view details
   d) Select two products and click "Compare"
4. Filters update results instantly (no page reload)
```

### 2.3 Key Data / Logic
- **Search query:** Text match on product name, category, seller name
- **Filters applied:** AND logic (Category=Chicken Chop AND Price<RM20)
- **Sort options:**
  - Best Value (default) — Uses best_value_score
  - Price: Low to High
  - Price: High to Low
  - Rating: High to Low
- **Results count:** Shows "24 results for 'chicken chop'"
- **Active filters:** Shown as removable chips above results

### 2.4 UI Requirements

**Layout:**
- **Left sidebar (250-280px):** Filters
- **Right main area:** Results grid
- **Responsive:** Mobile shows filters as collapsible drawer or bottom sheet

**Filter Panel:**
- Background: White or light gray
- Sections: Category, Price Range, Seller Type, Rating
- Section headers: 14px semibold, uppercase, letter-spacing 0.5px
- Checkboxes: Custom styled, 18px
- Count badges: "Chicken Chop (12)" — gray, 12px
- Price slider: Dual handle (min-max)
- Clear all button: At bottom, secondary style

**Results Area:**
- **Header:** "24 results for 'chicken chop'" + Sort dropdown
- **Active filters:** Chips above results (removable X)
- **Grid:** 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- **Gap:** 16px between cards
- **Pagination:** Infinite scroll preferred, or Load More button

**Product Cards (in results):**
- Image (80px height)
- Product name (16px bold, truncate)
- Seller name (13px gray)
- Price (18px bold)
- Value score badge (green/yellow/red)
- Rating (★ 4.5)
- Compare checkbox (select for comparison)

**Compare Bar (floating):**
- Appears when 2 products selected
- "Compare 2 products" button
- Clear selection option
- Position: Fixed bottom or sticky top

### 2.5 Common Mistakes

❌ **Filter panel too wide** — Takes >30% of screen, leaves no room for results  
❌ **No active filter indication** — User forgets filters are applied  
❌ **Results too dense** — Cards touching, no breathing room  
❌ **No empty state** — Blank screen when no results  
❌ **Slow filter updates** — User waits >1s for results to update  
❌ **Infinite scrolling without "Back to Top"** — User gets lost  

✅ **Fix:** 250px filter panel, active filter chips, 16px gaps, designed empty state, instant filtering

---

## 3. COMPARE PAGE (CRITICAL FEATURE)

### 3.1 Purpose
The compare page is the **core value proposition**. It shows two products side-by-side so users instantly see which is better value.

**Problem it solves:**
- "Which chicken chop gives me more for my money?"
- "Is McDonald's or KFC better value?"
- "Am I overpaying at this seller?"

**This is the most important feature. Everything else supports this.**

### 3.2 User Flow

**Flow A: Quick Compare (from categories)**
```
1. User clicks "Compare" on homepage or category
2. Page loads with pre-selected popular comparison (e.g., McD vs KFC)
3. User sees side-by-side comparison
4. Winner highlighted clearly
5. User can:
   - See detailed breakdown
   - Swap one product for another
   - Click to order/view details
```

**Flow B: Custom Compare (from search)**
```
1. User searches for products
2. User selects 2 products (checkboxes)
3. User clicks "Compare" floating button
4. Page loads with selected products side-by-side
5. Comparison shows differences highlighted
```

### 3.3 Key Data / Logic

**Comparison Attributes:**
1. **Product name + Image** — Identity
2. **Price** — Primary decision factor
3. **Value Score** — Calculated score (0-100, higher=better value)
4. **Rating** — Customer satisfaction (0-5 stars)
5. **Portion Size** — Small/Medium/Large
6. **Distance** — How far from user
7. **Seller type** — Chain vs Local
8. **Offers** — Discounts, bundles

**Winner Logic:**
- Product with higher Value Score wins
- Savings calculated: Price difference shown
- Winning attributes marked with ✓ checkmark
- Losing attributes marked subtly or left plain

**Visual Indicators:**
- Winner card: Green border or "Winner" badge
- Loser card: No special styling (neutral)
- Savings: "Save RM3.50" badge on winner
- Checkmarks (✓) on winning attributes

### 3.4 UI Requirements

**Header:**
- "Compare: [Product A] vs [Product B]"
- Back button to search
- Swap button (switch one product)

**Main Comparison Grid:**
```
┌──────────────────┬──────────────────┐
│                  │                  │
│   [IMAGE 1]      │   [IMAGE 2]      │
│   Product A      │   Product B      │
│                  │                  │
├──────────────────┼──────────────────┤
│ RM15.00          │ RM12.50          │ ← Prices large
│ Value: 72        │ Value: 85 ✓ WIN  │ ← Winner marked
├──────────────────┼──────────────────┤
│ Rating: 4.2      │ Rating: 4.5 ✓    │ ← Winner has check
│ Portion: Medium  │ Portion: Large ✓ │
│ Distance: 2.5km  │ Distance: 1.8km ✓│
│ Chain            │ Local            │
└──────────────────┴──────────────────┘
```

**Design Specifications:**
- **Layout:** Side-by-side (desktop), Stacked with A/B tabs (mobile)
- **Column width:** Equal 50% each
- **Gap:** 24px between columns
- **VS indicator:** Centered between columns, large text or icon
- **Winner badge:** "Best Value" or "Winner" pill badge, green
- **Savings highlight:** Large text "Save RM3.50" below winner price

**Attribute Comparison:**
- **Row style:** Alternating light gray / white backgrounds
- **Label:** Left-aligned, 14px gray
- **Values:** Centered in each column
- **Winner check:** Green checkmark (✓) next to winning value
- **Max rows:** 6-8 attributes (don't overwhelm)

**Detailed Breakdown (expandable):**
- "Show more details" link
- Expands to show:
  - Full descriptions
  - All offers
  - Ingredient list (if available)
  - Full reviews summary

**CTA Section:**
- Winner card has prominent "Order Now" or "View Details" button
- Loser has secondary "View Details" button
- "Start New Comparison" link below

### 3.5 Common Mistakes

❌ **No clear winner** — User can't tell which is better  
❌ **Too many attributes** — 12+ rows = information overload  
❌ **Uneven column widths** — Looks unprofessional  
❌ **No savings calculation** — User can't see the value of choosing winner  
❌ **Mobile: Side-by-side** — Impossible to read on small screens  
❌ **Missing images** — Products need visual identity  
❌ **No action after compare** — User decides but can't act  

✅ **Fix:** Clear winner badge, max 6 attributes, equal columns, savings prominent, mobile stack with tabs, clear CTAs

---

## 4. PRODUCT CARD SYSTEM

### 4.1 Purpose
Product cards are the **universal building block**. They appear on Search, Seller Dashboard, Compare page, and more. They must be instantly scannable and decision-friendly.

**Problem it solves:**
- "Show me the key info I need to decide, nothing else"
- Consistent experience across the app

### 4.2 User Flow
Product cards don't have a flow — they're a component. But users interact with them:
```
1. User sees card
2. User scans: Image → Name → Price → Value Score
3. User decides: Click for details, or select for compare
```

### 4.3 Key Data / Logic

**Information Hierarchy (most to least important):**
1. **Product image** — Visual recognition
2. **Price** — Primary decision factor
3. **Value score** — Unique selling point of CompareBite
4. **Product name** — What it is
5. **Rating** — Quality indicator
6. **Seller name** — Who sells it
7. **Distance** — How far (if location-enabled)

**Badge System:**
- **Best Value (Green):** Value score ≥ 80
- **Hidden Gem (Blue):** Value score ≥ 70 AND rating ≥ 4.5 AND < 20 reviews
- **Local Favorite (Yellow):** Top-rated local seller in category
- **Overpriced (Red):** Price > 30% above category average

### 4.4 UI Requirements

**Card Structure:**
```
┌─────────────────────────────┐
│ [IMAGE 80px]               │  ← Full width, object-cover
├─────────────────────────────┤
│ PRODUCT NAME        [BADGE] │  ← 16px bold, truncate 1 line
│ Seller Name          ★ 4.5  │  ← 13px gray
│                             │
│ RM12.50     Value: 85       │  ← Price 18px bold, score badge
│ [    Compare Button    ]    │  ← Full width, 40px height
└─────────────────────────────┘
```

**Dimensions:**
- **Width:** Flexible (responsive grid), min 280px
- **Height:** Auto, max ~200px
- **Padding:** 16px
- **Border-radius:** 12px
- **Background:** White
- **Border:** 1px solid #E5E7EB (subtle)
- **Shadow:** None or very subtle (0 1px 2px rgba(0,0,0,0.05))

**Image:**
- **Height:** 80px fixed
- **Object-fit:** cover
- **Border-radius:** 8px (inside card padding)
- **Fallback:** Gray placeholder with food icon

**Typography:**
- **Product name:** 16px, semibold, 1 line max (truncate with ...)
- **Seller name:** 13px, gray (#6B7280), 1 line
- **Price:** 18px, bold, primary color or black
- **Rating:** 14px, star icon + number

**Badges:**
- **Position:** Top-right of product name, or inline after name
- **Style:** Pill-shaped (rounded-full), max 2 badges
- **Colors:** Match badge type (green/blue/yellow/red)
- **Size:** 12px text, 4px 10px padding

**Actions:**
- **Compare checkbox:** Top-right corner or in actions row
- **Primary button:** "View" or "Compare" — full width, 40px height
- **Secondary action:** "Save" (heart icon) — optional

### 4.5 Common Mistakes

❌ **Inconsistent cards across pages** — Breaks user trust  
❌ **Too many badges** — 3+ badges = noise  
❌ **Product name wraps to 3 lines** — Card height becomes unpredictable  
❌ **Missing value score** — This is our unique feature, must be visible  
❌ **Button too small** — Hard to tap on mobile  
❌ **Image too large** — Takes up 50% of card, pushes info down  
❌ **No hover state** — User doesn't know card is clickable  

✅ **Fix:** Standardized card component, max 2 badges, 1-line names, value score always visible, 40px min button, 80px image height

---

## 5. SELLER DASHBOARD

### 5.1 Purpose
The seller dashboard is the **command center for sellers**. It shows their products, performance stats, and areas needing improvement. Must feel professional but not overwhelming.

**Problem it solves:**
- "How are my products performing?"
- "What should I fix first?"
- "How do I compare to others?"

### 5.2 User Flow
```
1. Seller lands on dashboard (via profile or direct link)
2. Seller sees:
   - Header with their name/location
   - Stats cards (4 key metrics)
   - Top products section
   - Products needing improvement
3. Seller can:
   - Click any product to edit
   - Click "Insights" for detailed analysis
   - Click "Add Product" to list new item
   - See their overall ranking
```

### 5.3 Key Data / Logic

**Stats Shown:**
1. **Total Products** — How many items they sell
2. **Average Rating** — Mean rating across all products
3. **Average Price** — Mean price (helps them position)
4. **Category Rank** — Their rank vs other sellers in category (#3 of 12)

**Product Sections:**
1. **Top Rated Products** — Their best items (rating ≥ 4.5)
2. **Best Value Products** — Items with value score ≥ 75
3. **Needs Improvement** — Low rating, low value score, or high price vs category

**Insights Preview:**
- Small card teasing full insights
- "See detailed insights →" link
- One key stat: "Top opportunity: [Product Name]"

### 5.4 UI Requirements

**Header:**
- **Seller name:** 24px bold
- **Address:** 14px gray
- **Actions:** "Edit Profile", "View Public Page" (secondary buttons)
- **Background:** White, border-bottom separator

**Stats Row:**
- **4 cards in a row** (desktop), 2x2 grid (mobile)
- **Card style:** White background, 20px padding, 12px border-radius
- **Label:** 12px gray uppercase, letter-spacing
- **Value:** 32px bold, primary metric
- **Change indicator:** Small arrow + % vs last month (optional)

**Stats Display:**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 24          │ │ 4.2 ★       │ │ RM12.50     │ │ #3          │
│ PRODUCTS    │ │ AVG RATING  │ │ AVG PRICE   │ │ IN CATEGORY │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

**Product Sections:**
- **Section header:** 18px semibold + "View All →" link
- **Horizontal scroll:** Product cards in row
- **Card style:** Same as search page product cards
- **Max visible:** 4-5 cards before scroll

**Needs Improvement Section:**
- **Style:** List view (not cards) to show details
- **Columns:** Product | Issue | Suggested Action
- **Issue badges:** Red for problems, yellow for warnings
- **Suggested actions:** Brief text, link to detailed insights

**Insights Teaser:**
- **Card style:** Light blue background, blue border-left (4px)
- **Icon:** Chart or lightbulb
- **Text:** "Top opportunity: Chicken Chop Deluxe could earn +RM450 more per month"
- **CTA:** "View Full Insights →" button

### 5.5 Common Mistakes

❌ **Too many stats** — 8+ metrics = overwhelming, none stand out  
❌ **No prioritization** — "Needs improvement" buried at bottom  
❌ **Complex charts** — Sellers don't need analytics, they need actions  
❌ **Inconsistent product cards** — Different from search page  
❌ **No clear actions** — Just data, no "what should I do?"  
❌ **Edit buttons hidden** — Hard to find how to update products  

✅ **Fix:** 4 stats max, clear prioritization (needs improvement prominent), simple text-based insights, consistent cards, clear CTAs

---

## 6. SELLER INSIGHTS

### 6.1 Purpose
Seller Insights provides **business intelligence** to help sellers improve profitability and competitiveness. It turns data into actionable recommendations.

**Problem it solves:**
- "Which of my products should I improve first?"
- "Am I pricing correctly vs competitors?"
- "What if I raise/lower my price?"

### 6.2 User Flow
```
1. Seller navigates to Insights (from dashboard or profile)
2. Page loads with 7 tabs of analysis
3. Default tab: "Top Opportunity" (highest priority)
4. Seller can:
   - Browse all 7 tabs
   - See specific recommendations per tab
   - Use price simulator
   - Click back to dashboard
```

### 6.3 Key Data / Logic

**The 7 Tabs:**

1. **Top Opportunity** — Product with highest improvement potential
   - Shows: Product name, current profit, potential gain, recommended action
   
2. **Menu Profit** — Overall profitability analysis
   - Shows: Total estimated profit, profit by product, best/worst performers
   
3. **Low Profit Items** — Products with thin margins
   - Shows: Items with profit < RM3, suggestions to improve
   
4. **Overpriced Risk** — Products priced above market
   - Shows: Items > 20% above category average, customer loss risk
   
5. **Profit vs Value** — Price simulation tool
   - Shows: Interactive slider, profit change at different prices
   
6. **Menu Balance** — Category distribution analysis
   - Shows: Food vs drink mix, price range coverage
   
7. **All Products** — Complete product table
   - Shows: All products with key metrics, sortable

**Calculations (High-Level):**
- Estimated cost = Price × 0.6 (industry average)
- Profit per sale = Price - Estimated cost
- Monthly profit = Profit per sale × 50 (default sales volume)
- Value score = Calculated from rating, price vs avg, portion, offers
- Category average = Mean price of all products in category
- Overpriced threshold = > 20% above category average

### 6.4 UI Requirements

**Header:**
- "Seller Insights — [Seller Name]"
- Back to dashboard button
- "Analyzing X products" indicator

**Tab Navigation:**
- **Style:** Colorful buttons (not standard gray tabs)
- **Active tab:** Filled color, white text
- **Inactive tab:** White, colored text
- **Tab colors:**
  - Opportunity: Orange/Red
  - Profit: Green
  - Low Profit: Red
  - Overpriced: Yellow
  - Simulation: Blue
  - Balance: Purple
  - Products: Indigo

**Tab Content Cards:**
- **Header style:** Light tinted background matching tab color
- **Icon:** 24px, matching tab color
- **Content:** White background, 20px padding
- **Issue boxes:** Light red background, red border, rounded
- **Opportunity boxes:** Light green background, green border
- **Numbers:** Large, bold, prominent

**Example: Top Opportunity Tab**
```
┌─────────────────────────────────────────────┐
│ 🔥 Top Opportunity (orange header)            │
├─────────────────────────────────────────────┤
│                                             │
│  Chicken Chop Deluxe                        │
│  RM8.00  →  Potential: +RM450/month          │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ⚠️ ISSUE: Low value score (65)     │   │
│  │ Despite good profit margin           │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 💡 ACTION: Add bundle deal or      │   │
│  │ increase portion size to boost     │   │
│  │ perceived value                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Example: Price Simulator Tab**
```
┌─────────────────────────────────────────────┐
│ 🧮 Profit vs Value (blue header)              │
├─────────────────────────────────────────────┤
│                                             │
│  Select product: [Chicken Chop Deluxe ▼]   │
│                                             │
│  Current price: RM12.00                      │
│  Current profit: RM4.80/sale                 │
│  Current value score: 72                     │
│                                             │
│  Simulate new price:                         │
│  [=========●=========] RM15.00              │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ If price = RM15.00:                │   │
│  │ Profit: RM6.00/sale (+RM1.20)      │   │
│  │ Value score: ~58 (-14 points)      │   │
│  │ Risk: May lose price-sensitive     │   │
│  │ customers                          │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### 6.5 Common Mistakes

❌ **Gray, boring tabs** — Insights should feel important, use color  
❌ **Too much text** — Sellers scan, not read paragraphs  
❌ **No clear actions** — "Here's a problem" without "Here's what to do"  
❌ **Complex charts** — Tables and text > charts for this audience  
❌ **All tabs look the same** — Visual distinction helps navigation  
❌ **Missing numbers** — "Good profit" is vague, "RM450/month" is clear  

✅ **Fix:** Colorful tabs, concise text, clear action boxes, simple tables, large numbers

---

## 7. PRODUCT TESTER

### 7.1 Purpose
The Product Tester lets sellers **preview how a new product will perform before listing it**. It calculates a readiness score and provides improvement suggestions.

**Problem it solves:**
- "Should I list this product at this price?"
- "What will my value score be?"
- "How competitive am I?"

### 7.2 User Flow
```
1. Seller navigates to Product Tester
2. Seller inputs product details:
   - Name
   - Category
   - Price
   - Portion size
   - Expected rating (or use default)
3. System calculates:
   - Readiness score
   - Predicted value score
   - Comparison to category
   - Suggestions
4. Seller sees results with recommendations
5. Seller can adjust inputs and re-test
```

### 7.3 Key Data / Logic

**Input Fields:**
- Product name (text)
- Category (dropdown: Chicken Chop, Burger, etc.)
- Price (number, RM)
- Portion size (Small/Medium/Large)
- Expected rating (1-5, default 3.5 for new products)
- Offers (optional: discount %, bundle deal)

**Calculations:**
- **Category average price:** Loaded from database
- **Predicted value score:** Based on price vs avg, portion, offers
- **Readiness score:** Composite of price competitiveness, expected rating, value score
- **Status:** "Ready to list" (score ≥ 70), "Needs improvement" (< 70)

**Suggestions Generated:**
- If price > category avg: "Consider pricing at RM[X] to be competitive"
- If portion small: "Increase portion size or lower price"
- If no offers: "Add opening promotion to boost initial reviews"
- If rating low: "Focus on quality to achieve 4+ star rating"

### 7.4 UI Requirements

**Input Section:**
- **Layout:** Form, single column, labels above inputs
- **Input height:** 44px minimum
- **Dropdowns:** Custom styled, show category icons if available
- **Price input:** RM prefix, number only
- **Portion size:** Segmented button (Small | Medium | Large)
- **Test button:** Primary, full width, "Calculate Readiness"

**Results Section:**
- **Readiness score:** Large circular progress or big number (0-100)
- **Color coding:**
  - 80-100: Green "Ready to list"
  - 60-79: Yellow "Good, could improve"
  - 0-59: Red "Needs work"
- **Predicted value score:** Secondary metric
- **Category position:** "Priced 15% above average" or "Most affordable in category"

**Suggestions List:**
- **Format:** Bullet list or small cards
- **Style:** Icon + text, color-coded by severity
- **Green suggestions:** Strengths to maintain
- **Yellow suggestions:** Improvements to consider
- **Red suggestions:** Critical issues to fix

**Example Results:**
```
┌─────────────────────────────────────────────┐
│                                             │
│            ┌─────────┐                      │
│            │   72    │  Readiness Score    │
│            │  / 100  │                      │
│            └─────────┘                      │
│                                             │
│         Good — Ready to list with tweaks   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Predicted value score: 68                  │
│  Category position: Above average price     │
│                                             │
│  Suggestions:                               │
│  ✅ Portion size is competitive             │
│  ⚠️  Price 20% above category average       │
│  ❌ Add opening promotion for visibility    │
│                                             │
│  [Edit Product] [List Anyway]               │
│                                             │
└─────────────────────────────────────────────┘
```

### 7.5 Common Mistakes

❌ **Too many input fields** — 10+ fields = abandonment  
❌ **No instant feedback** — User waits, no loading state  
❌ **Vague results** — "Your score is okay" — not actionable  
❌ **No comparison context** — Score without category context is meaningless  
❌ **Missing suggested price** — "Too expensive" without "Try RM[X]"  
❌ **No re-test button** — Can't quickly iterate on inputs  

✅ **Fix:** 6-7 fields max, instant calculation with loading state, specific suggestions, clear category context, suggested optimal price, one-click re-test

---

## 8. LEADERBOARD

### 8.1 Purpose
The Leaderboard is a **discovery and transparency tool**. It shows top-performing products by category, helping users find great options and motivating sellers to improve.

**Problem it solves:**
- "What's the best chicken chop in my area?"
- "Which sellers are the top performers?"
- "As a seller, where do I rank?"

### 8.2 User Flow
```
1. User navigates to Leaderboard
2. Page shows:
   - Food / Drinks toggle
   - Best Overall / Local / Chain tabs
   - Ranked list of products
3. User can:
   - Toggle Food vs Drinks
   - Switch between Overall/Local/Chain
   - Click any product to view details
   - See seller rank badges
```

### 8.3 Key Data / Logic

**Categories:**
- **Food:** Chicken Chop, Burger, Nasi Lemak, Pizza, Noodles, Rice
- **Drinks:** Coffee, Tea, Soft Drinks, Juice, Bubble Tea

**Ranking Tabs:**
- **Best Overall:** Top products regardless of seller type
- **Local:** Only local (non-chain) sellers
- **Chain:** Only chain sellers (McD, KFC, etc.)

**Ranking Criteria:**
- Primary: Value score (highest first)
- Tiebreaker: Rating (highest first)
- Secondary tiebreaker: Number of reviews

**Display:**
- Rank #1, #2, #3... with medal icons or badges
- Product card with all standard info
- Seller badge: "#1 Local Seller" or "Top 5 Chain"

### 8.4 UI Requirements

**Toggle Controls:**
```
┌─────────────────────────────────────────────┐
│                                             │
│    [🍔 Food]  [🥤 Drinks]                   │
│    (toggle pill/button group)               │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  [Best Overall] [Local ★] [Chain 🏢]        │
│  (tab-style or segmented control)           │
│                                             │
└─────────────────────────────────────────────┘
```

**Food/Drinks Toggle:**
- **Style:** Pill toggle or button group
- **Active:** Filled background
- **Icons:** Food icon for Food, Drink icon for Drinks
- **Animation:** Smooth switch, content fades

**Ranking Tabs:**
- **Best Overall:** No special badge filter
- **Local:** Filter: seller.chain === null || seller.chain === undefined
- **Chain:** Filter: seller.chain !== null

**Product List:**
- **Rank indicator:** Large number or medal (🥇 🥈 🥉)
- **Card style:** Same as search product cards
- **Layout:** Vertical list (not grid), emphasis on ranking
- **Spacing:** More generous spacing than search (ranking is special)

**Rank Display:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  🥇 #1                                      │
│  ┌─────────────────────────────────────┐   │
│  │ [IMAGE]  Chicken Chop Deluxe         │   │
│  │          Secret Recipe Cafe          │   │
│  │          ★ 4.8  Value: 92            │   │
│  │          RM14.50                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  🥈 #2                                      │
│  ┌─────────────────────────────────────┐   │
│  │ [IMAGE]  ...                       │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Seller Badges:**
- Show on product cards if applicable
- "#1 Local Seller" — Gold badge
- "Top 3 Chain" — Blue badge
- "Rising Star" — New seller with fast growth

### 8.5 Common Mistakes

❌ **Grid layout for rankings** — Ranking needs vertical hierarchy, not grid  
❌ **No rank indicators** — Just a list, user can't tell #1 from #10  
❌ **Unclear toggle state** — User doesn't know if they're viewing Food or Drinks  
❌ **Missing Local/Chain distinction** — User wants to support local or prefers chains  
❌ **Same design as search results** — Leaderboard should feel special/important  
❌ **No seller motivation** — Sellers don't see their rank or how to improve  

✅ **Fix:** Vertical ranked list, prominent rank numbers/medals, clear toggle states, Local/Chain tabs, slightly elevated design, seller rank context

---

## 9. NAVIGATION SYSTEM

### 9.1 Purpose
The navigation system provides **wayfinding** across the app. It must be minimal, clear, and not compete with the main content.

**Core principle:** CompareBite is about content (products, comparisons), not about navigation. Navigation should fade into the background.

### 9.2 Navigation Elements

**Primary Navigation (Navbar):**
1. **Logo** — Click to Home
2. **Search** — Universal search bar (collapsible on mobile)
3. **Profile Dropdown** — Consumer/Seller menu

**What appears in Profile Dropdown:**

**For Consumers:**
- Consumer View (Home)
- Search
- Compare
- Leaderboard

**For Sellers:**
- Seller Dashboard
- Product Tester
- Seller Insights

**What does NOT appear:**
- Savings page (removed — cluttered navigation)
- Direct links to specific sellers (use dashboard)
- Admin tools (not relevant to users)

### 9.3 UI Requirements

**Navbar:**
- **Height:** 64px
- **Background:** White with subtle shadow
- **Position:** Sticky top
- **Z-index:** High (always on top)

**Logo:**
- **Position:** Left
- **Size:** 32px height
- **Text:** "CompareBite" next to logo mark

**Search Bar (in navbar):**
- **Width:** 300-400px (collapses to icon on mobile)
- **Height:** 40px
- **Placeholder:** "Search..."
- **Icon:** Search icon left

**Profile Dropdown:**
- **Trigger:** Avatar + "CB" initials
- **Menu:** White card, shadow, rounded
- **Sections:** Role label + links
- **Dividers:** Between sections

**Mobile Navigation:**
- **Bottom bar:** Home, Search, Compare, Profile icons
- **Height:** 56px
- **Active state:** Filled icon + color
- **Inactive:** Outline icon + gray

### 9.4 Common Mistakes

❌ **Too many nav items** — 7+ items = cognitive overload  
❌ **Savings in nav** — Clutters, not core feature  
❌ **No active state indication** — User doesn't know which page they're on  
❌ **Hidden on scroll** — User needs nav always accessible  
❌ **Mobile: Hamburger menu** — Bottom nav is better for mobile apps  

✅ **Fix:** 4-5 items max, active state clear, sticky nav, bottom nav for mobile, minimal dropdown

---

# 🔹 PART 3: CROSS-FEATURE CONSISTENCY RULES

These rules apply to ALL features. Breaking them breaks user trust.

## 1. Same Product Card Everywhere

**Rule:** The product card component must be identical on:
- Search page
- Seller dashboard
- Compare page (when selecting products)
- Leaderboard

**Why:** Users learn the card once, read it instantly everywhere.

---

## 2. Same Value Score Representation

**Rule:** Value score always displayed the same way:
- Badge style: Pill-shaped
- Colors: Green (≥80), Yellow (60-79), Red (<60)
- Label: "Value: [score]"

**Why:** Consistent meaning. User trusts the score.

---

## 3. Same Colors for Same Meanings

**Rule:** Color semantics are app-wide:
- **Green:** Best value, positive, success
- **Red:** Overpriced, warning, error
- **Yellow:** Caution, medium, "could be better"
- **Blue:** Information, neutral highlight

**Why:** Don't confuse users with changing color meanings.

---

## 4. No Conflicting Numbers

**Rule:** If a product shows value score 85 on Search, it must show 85 on Dashboard, Compare, and Leaderboard.

**Why:** Inconsistency destroys trust in the platform.

---

## 5. Same Button Styles

**Rule:** Use only these button styles everywhere:
- **Primary:** Red background, white text
- **Secondary:** White background, gray border, dark text
- **Ghost:** Transparent, red text
- **Sizes:** Small (32px), Medium (40px), Large (48px)

**Why:** Users recognize affordances instantly.

---

## 6. Same Spacing Scale

**Rule:** All spacing uses 4px increments:
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

**Why:** Visual rhythm. Professional polish.

---

# 🔹 PART 4: DESIGN PRIORITY SYSTEM

## What Matters MOST (Do These First)

### 1. Compare Feature
**Priority:** CRITICAL

This is the core value proposition. If compare doesn't work perfectly, the app fails.

**Requirements:**
- Side-by-side layout
- Clear winner indication
- Savings calculation prominent
- Mobile: Stacked with clear comparison
- Load instantly

---

### 2. Search Clarity
**Priority:** HIGH

Search is the entry point. If users can't find products, nothing else matters.

**Requirements:**
- Fast results (< 2 seconds)
- Clear filters
- Product cards scannable
- Empty state helpful

---

### 3. Product Cards
**Priority:** HIGH

Product cards appear everywhere. They must be perfect.

**Requirements:**
- Consistent across all pages
- Value score visible
- Price prominent
- Image + name clear

---

### 4. Seller Dashboard
**Priority:** MEDIUM-HIGH

Sellers need to understand their performance.

**Requirements:**
- 4 stats max (don't overwhelm)
- Clear improvement suggestions
- Easy navigation to insights
- Edit actions accessible

---

## What Matters LESS (Do These Last)

### 1. Decorative Elements
**Priority:** LOW

Decorations that don't help decisions:
- Illustrations
- Fancy gradients
- Background patterns
- Decorative animations

**Rule:** If removing it doesn't hurt functionality, remove it.

---

### 2. Fancy Animations
**Priority:** LOW

Animations that don't serve purpose:
- Page transitions
- Bouncing elements
- Parallax scrolling
- Spinning loaders (use simple spinners)

**Rule:** Animation must speed up interaction or provide feedback. Never for decoration.

---

### 3. Secondary Features
**Priority:** LOW

Features that support but aren't core:
- Savings page (removed from nav)
- Detailed analytics
- Complex filtering (advanced filters hidden)
- Social features (sharing, following)

**Rule:** Core features must be perfect before polishing secondary ones.

---

# 🔹 PART 5: COMMON DESIGN FAILURES

## ❌ Adding Too Many Cards

**The Failure:** Every piece of information gets its own card. Result: Cluttered, overwhelming screens.

**Example:**
- Stat cards for every metric (8+ cards)
- Filter options in cards
- Navigation items in cards

**The Fix:** Cards group related content. Simple information (stats, filters) doesn't need cards. Use flat design.

---

## ❌ Making Dashboard Too Complex

**The Failure:** Sellers see analytics dashboard with charts, graphs, and 12 metrics. They're overwhelmed and don't know what to do.

**Example:**
- Line charts of sales over time
- Pie charts of category distribution
- 8 stat cards in a grid
- Raw data tables

**The Fix:** 4 stats max. Simple text-based insights. "Top opportunity" card. Clear action recommendations.

---

## ❌ Hiding Compare Feature

**The Failure:** Compare is the core feature but it's buried behind multiple clicks or hidden in menus.

**Example:**
- Compare only accessible from product detail page
- No compare button on search results
- Compare requires 5 steps to reach

**The Fix:** Compare button on every product card. Prominent compare teaser on homepage. One-tap compare from search.

---

## ❌ Making User Think Too Much

**The Failure:** UI requires cognitive effort to understand. Users abandon.

**Examples:**
- Ambiguous icons without labels
- Clever but unclear navigation labels
- Information overload on single screen
- Unconventional layouts

**The Fix:** Clear labels. Standard patterns. Progressive disclosure (show more on demand).

---

## ❌ Inconsistent Layouts

**The Failure:** Every page feels like a different app. User must relearn each screen.

**Examples:**
- Product cards different on Search vs Dashboard
- Buttons different styles on different pages
- Navigation changes position
- Color meanings change

**The Fix:** Component library. Design system. Strict consistency rules.

---

## ❌ Mobile Afterthought

**The Failure:** Desktop design is done first, then "squeezed" into mobile. Mobile experience is broken.

**Examples:**
- Side-by-side compare unusable on mobile
- Filters as sidebar (should be bottom sheet)
- Touch targets too small
- Horizontal scrolling

**The Fix:** Design mobile first. Mobile constraints force clarity. Scale up to desktop.

---

## ❌ No Empty States

**The Failure:** When there's no data, screen is blank white. User thinks app is broken.

**Examples:**
- No search results = blank page
- No products in dashboard = empty white space
- Loading = blank screen

**The Fix:** Designed empty states with:
- Icon (48px, gray or brand color)
- Clear message: "No results found"
- Explanation: "Try different search terms"
- Action: "Clear filters" or "Browse all"

---

## ❌ Poor Loading States

**The Failure:** User action gives no feedback. User thinks click didn't work.

**Examples:**
- Button click = no change
- Search = no spinner
- Page load = blank white

**The Fix:**
- Buttons: Show spinner inside, disable button
- Search: Inline spinner in search bar
- Page load: Skeleton screens
- Images: Gray placeholder with icon

---

# 🔹 PART 6: FINAL CHECKLIST FOR KAI JING

Before finalizing any design, ask these questions:

## Clarity Check
- [ ] Can a user understand this screen in 3 seconds?
- [ ] Is the primary action obvious at first glance?
- [ ] Are labels self-explanatory (no guessing required)?
- [ ] Is the information hierarchy clear (most important first)?

## Function Check
- [ ] Does every element help the user make a decision?
- [ ] Is the fastest path to value clear?
- [ ] Are there clear next steps for the user?
- [ ] Does this reduce friction or add it?

## Compare Check (CRITICAL)
- [ ] Is compare feature accessible from this screen?
- [ ] Would compare make sense as a next action here?
- [ ] Are product cards optimized for compare selection?

## Consistency Check
- [ ] Does this match the product card design?
- [ ] Are colors used consistently (green=good, red=bad)?
- [ ] Are button styles the same as elsewhere?
- [ ] Is spacing following the 4px scale?

## Cleanliness Check
- [ ] Is UI clean or cluttered?
- [ ] Are we showing unnecessary information?
- [ ] Can any element be removed without hurting functionality?
- [ ] Is there sufficient whitespace?

## Mobile Check
- [ ] Does this work on 375px width (iPhone SE)?
- [ ] Are touch targets minimum 44px?
- [ ] Is text readable without zooming?
- [ ] No horizontal scrolling required?

## Polish Check
- [ ] Are loading states designed?
- [ ] Are empty states designed?
- [ ] Are error states designed?
- [ ] Are hover/focus states defined?

---

## The Ultimate Test

Show your design to someone who hasn't seen it before.

Ask them:
1. "What is this page for?"
2. "What would you click first?"
3. "Which product is the better deal?"

If they hesitate or answer wrong, redesign.

---

# 🔹 PART 7: FINAL MINDSET

## The CompareBite Philosophy

> **"You are not designing a pretty app. You are designing a decision-making tool."**

Your users are:
- **Hungry** — They want food NOW
- **Busy** — They have 2 minutes to decide
- **Budget-conscious** — They want value
- **Not designers** — They don't care about aesthetics

### What They Want

❌ They don't want: "Beautiful gradients and animations"
✅ They want: "I found the best value meal in 10 seconds"

❌ They don't want: "Comprehensive analytics dashboard"
✅ They want: "Tell me exactly what to improve and how"

❌ They don't want: "Creative navigation experience"
✅ They want: "I knew exactly where to click without thinking"

---

## Remember

**Every design decision must pass this test:**

> **"Does this help the user decide faster?"**

- **YES** → Keep it.
- **NO** → Remove it.
- **MAYBE** → Test with real users.

---

## For Kai Jing

You are not just pushing pixels.
You are not just making things look good.
You are not just following trends.

**You are:**
✅ Removing friction from hungry people's lives
✅ Helping small sellers compete and improve
✅ Making value transparent in a confusing market
✅ Building a tool that saves people time and money

**Design with intention.**
**Design with empathy.**
**Design for decisions.**

---

# APPENDIX: QUICK REFERENCE

## Core Flows
- **Consumer:** Search → Compare → Decide → Save Money
- **Seller:** View → Analyze → Adjust → Improve

## Key Metrics
- **Value Score:** 0-100 (higher = better value)
- **Rating:** 0-5 stars
- **Readiness Score:** 0-100 (for product tester)

## Color Meanings
- **Green:** Best value, positive, success
- **Red:** Overpriced, warning, error
- **Yellow:** Caution, medium
- **Blue:** Information, neutral

## Component Priority
1. Product Card (used everywhere)
2. Compare Layout (side-by-side)
3. Search + Filters
4. Stats Cards (4 max)
5. Insight Cards

## File Structure (for reference)
```
/app
  /page.tsx              → Homepage
  /search/page.tsx       → Search page
  /compare/page.tsx      → Compare page
  /leaderboard/page.tsx  → Leaderboard
  /product/[id]/page.tsx → Product detail
  /seller/
    /[id]/page.tsx       → Seller dashboard
    /insights/page.tsx   → Seller insights
    /test-product/page.tsx → Product tester
```

---

**End of Manifesto**

*Read this before every design session. Reference it daily.*
