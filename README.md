# 🍴 QuickBite

A restaurant menu browsing and cart-ordering app built as a portfolio demo.

🔗 **Live Demo:** [https://quick-bite-iota-three.vercel.app/](https://quick-bite-iota-three.vercel.app/)

## What it is

QuickBite lets you browse dishes by category, search by name, view full item details, and manage a shopping cart — all powered by the free [TheMealDB API](https://www.themealdb.com/api.php). No real payment is processed; clicking "Place Order" clears the cart and shows a confirmation screen.

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework & build tool |
| TypeScript | Type safety |
| Tailwind CSS v3 | Utility-first styling |
| React Router v6 | Client-side routing |
| TheMealDB API | Free public food/recipe data |
| React Context + useReducer | Cart state management |
| localStorage | Cart persistence across refreshes |
| Vercel | Hosting & deployment |

## Features

- 🗂 **Category filter** — browse Seafood, Vegetarian, Dessert, and more
- 🔍 **Search** — client-side name filtering within any category
- 🛒 **Cart** — add, remove, increment, decrement; persisted to localStorage
- 📄 **Item detail** — full description, YouTube recipe link, and Add to Cart
- 💀 **Loading skeletons** — smooth loading states throughout
- 📱 **Fully responsive** — works on mobile, tablet, and desktop

## Running locally

```bash
# 1. Clone the repo
git clone https://github.com/SaadKhalid-PTUT036/quick-bite.git
cd quick-bite

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Building for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Deployment

The app is deployed on Vercel. Any push to `main` triggers an automatic redeploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Project structure

```
src/
├── components/       # Reusable UI components
│   ├── CartProvider.tsx
│   ├── CategoryFilter.tsx
│   ├── Header.tsx
│   ├── MenuItemCard.tsx
│   └── Skeleton.tsx
├── hooks/
│   └── useCart.ts    # Cart context hook
├── lib/
│   └── api.ts        # TheMealDB API client
├── pages/
│   ├── MenuPage.tsx
│   ├── CartPage.tsx
│   ├── ItemDetailPage.tsx
│   └── NotFoundPage.tsx
├── types/
│   └── index.ts      # Shared TypeScript types
├── App.tsx
├── main.tsx
└── index.css
```
