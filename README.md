# CompareBite

A platform that helps users compare food and drinks across sellers to find the best value.

## Features

- **Search & Compare** — Find and compare food items across multiple sellers
- **Best Value Scoring** — Algorithm-based value scoring considering price, rating, portion size, and offers
- **Seller Dashboard** — Manage products and view performance insights
- **Seller Insights** — Business intelligence with profit analysis, price simulation, and optimization tips
- **Product Tester** — Preview product performance before listing
- **Leaderboard** — Discover top-rated products by category

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Lucide icons
- **State Management:** React hooks (useState, useMemo, useEffect)
- **Data:** Static JSON files (products, locations)

## Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Outstay123/comparebite.git
cd comparebite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
```

### 5. Start Production Server

```bash
npm start
```

## Project Structure

```
comparebite/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Homepage
│   ├── search/            # Search page
│   ├── compare/           # Compare page
│   ├── leaderboard/       # Leaderboard page
│   ├── product/[id]/      # Product detail pages
│   └── seller/            # Seller dashboard & insights
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                   # Utilities & data
│   ├── data/             # JSON data files
│   ├── utils/            # Helper functions
│   └── types/            # TypeScript types
├── docs/                  # Documentation
│   ├── DESIGN_MANIFESTO.md
│   └── PRODUCT_MANIFESTO.md
├── public/               # Static assets
└── next.config.js        # Next.js configuration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Search and entry point |
| Search | `/search` | Find products with filters |
| Compare | `/compare` | Side-by-side product comparison |
| Leaderboard | `/leaderboard` | Top products by category |
| Product Detail | `/product/[id]` | Individual product info |
| Seller Dashboard | `/seller/[id]` | Seller's product management |
| Seller Insights | `/seller/insights?sellerId=[id]` | Business intelligence (7 tabs) |
| Product Tester | `/seller/test-product` | Preview product performance |

## Core Concepts

### Value Score
A 0-100 score calculated from:
- Rating quality (30%)
- Price vs category average (30%)
- Portion satisfaction (20%)
- Offers/bundles (15%)
- Review confidence (5%)

### Seller Insights Tabs
1. **Top Opportunity** — Highest potential improvement
2. **Menu Profit** — Overall profitability analysis
3. **Low Profit Items** — Products needing margin improvement
4. **Overpriced Risk** — Items priced above market
5. **Profit vs Value** — Price simulation tool
6. **Menu Balance** — Category distribution
7. **All Products** — Complete product metrics table

## Troubleshooting

### Build Errors
If you see `__webpack_modules__` error or similar:
```bash
Remove-Item -Recurse -Force .next
npm run build
```

### Port Already in Use
If port 3000 is taken, Next.js will automatically use 3001, 3002, etc.
Or specify a port:
```bash
npm run dev -- --port 3001
```

## Design Documentation

- [Design Manifesto](docs/DESIGN_MANIFESTO.md) — Visual design system and rules
- [Product Manifesto](docs/PRODUCT_MANIFESTO.md) — Feature breakdown and philosophy

## License

MIT

## Contributing

This is a demo project. For issues or suggestions, please open a GitHub issue.
