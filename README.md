# ThemeFlow — Static Marketplace Demo

A responsive, multi-page website concept for a premium website-theme marketplace. Built with plain HTML, CSS, and JavaScript; no build step or package installation required.

## Pages
- `index.html` — landing page, featured themes, FAQs, and seller CTA
- `themes.html` — searchable and filterable theme catalog
- `product.html?theme=north` — theme detail and illustrative preview (also supports `forma`, `orbit`, `mono`, `bloom`, `frame`)
- `seller.html` — seller dashboard concept and demo onboarding form
- `support.html` — help center and FAQ

## Run locally
Open `index.html` in a browser. For best results, use a simple local static server, or deploy the files to GitHub Pages.

## GitHub Pages
1. Extract the ZIP.
2. Upload the **contents** of this folder to the root of your repository (so `index.html` is at the repository root).
3. In GitHub, open **Settings → Pages** and choose your publishing source (usually `main` branch and `/ (root)`).
4. Save and wait for the Pages build to finish.

## Demo-only features — important
- Theme prices are illustrative, not live offers.
- Purchase buttons do not charge money or deliver files.
- Seller form only shows a local confirmation; it does not transmit or store data.
- Support chat uses local preset responses; no AI service, live agent, or server is connected.
- There is no authentication, product database, seller payout, or order backend.

Before accepting real customers, connect secure authentication, a backend/catalog database, payment processing, seller moderation, license management, file delivery, transactional email, and real customer support.

## Notes
- Responsive layout with scroll reveal animations and reduced-motion support.
- Uses relative asset paths for repository/project-site compatibility.
- Google Fonts are loaded remotely; system fallbacks are included.
