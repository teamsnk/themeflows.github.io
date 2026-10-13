# ThemeFlow — Premium Theme Marketplace (Static Demo)

A responsive, multi-page marketplace concept built with plain HTML, CSS, and JavaScript. Designed for free static hosting on GitHub Pages.

## Pages

- `index.html` — cinematic landing page, featured themes, creator CTA, FAQ preview
- `themes.html` — searchable and filterable theme catalog with sorting
- `product.html` — product details, preview, tabs, wishlist toggle, demo checkout notice
- `seller.html` — creator dashboard UI, sample analytics, sample listings, demo listing form
- `support.html` — searchable FAQ accordions and scripted support chat
- `assets/css/style.css` — all design styles and responsive behavior
- `assets/js/app.js` — scroll reveals, parallax, filters, demo chat, product page behavior, dashboard interactions
- `assets/images/favicon.svg` — site icon

## Run locally

Open `index.html` in a modern browser. No build step, npm, or framework required. Google Fonts are loaded remotely; the system font stack is used as a fallback.

## Publish for free on GitHub Pages

1. Create a GitHub repository. For the account homepage URL `https://YOUR-USERNAME.github.io/`, name the repository exactly `YOUR-USERNAME.github.io`.
2. Upload the **contents** of this folder (so `index.html` is at the repository root).
3. In GitHub, open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to deploy. Your free URL will be `https://YOUR-USERNAME.github.io/`.
6. You can add a custom domain later; it is not needed for the first launch.

If you use a regular repository name instead, the URL will usually be `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`. Internal links in this project are relative, so the pages should work under a project path too.

## What's demo-only?

This is a **front-end UI prototype**, not a live commerce platform.

- Theme names, creator profiles, reviews, ratings, prices, sales, and analytics are illustrative sample data.
- Checkout is not connected. No money is collected and no purchase is created.
- Theme downloads and secure file delivery are not implemented.
- Seller registration, login, database persistence, and real listing publication are not implemented.
- Customer support chat uses a small scripted response set. It is **not a real AI model** and does not connect to a live agent.
- No AI API key, payment credentials, or private secrets should be added to browser JavaScript.

## Upgrade path when budget allows

1. Add a backend and database for user accounts, listings, wishlists, reviews, and orders.
2. Connect a payment provider and server-side purchase verification.
3. Store theme files in private object storage and provide authenticated, time-limited download links.
4. Add a server-side AI endpoint for support chat. Keep API keys in server environment variables, never in the public repository.
5. Add seller moderation, licensing, tax/payment workflow, abuse controls, privacy policy, and terms before accepting real customers.
6. Buy/connect a custom domain only when it makes business sense.

## Accessibility and motion

The site supports keyboard-focus styles, mobile navigation, and `prefers-reduced-motion`. Scroll reveal and parallax effects are progressive enhancements and the content remains readable without them.

## License

Use and adapt this demo for your own project. Replace sample content and review any third-party assets or terms before commercial launch.
