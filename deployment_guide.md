# AURELIA Deployment & Launch Guide

## 1. Domain Acquisition ($1 - $10)
To make your site professional, you need a custom domain (e.g., `www.aurelia-art.global`).

*   **Where to Buy**: Namecheap.com or Cloudflare.com (Best prices, no hidden fees).
*   **Extensions**: Look for `.xyz`, `.art`, or `.online` which are often $1-$3 for the first year.
*   **Privacy**: Ensure "Whois Privacy" is enabled (Free on Namecheap) to hide your personal info.

## 2. Hosting (Free)
Since AURELIA is a static site (HTML/JS), you can host it for free with Enterprise-grade speed.

*   **Netlify (Recommended)**:
    1.  Sign up at [netlify.com](https://netlify.com).
    2.  Drag and drop the folder containing your `index.html` and `backend.js`.
    3.  Your site is live instantly!
    4.  Go to "Domain Settings" to connect your purchased domain.
*   **GitHub Pages**: If you know Git, push your code to a repo and enable Pages.

## 3. Security (SSL)
*   Netlify and GitHub Pages provide **Free SSL (HTTPS)** automatically.
*   Your site will show the "Secure Lock" icon, crucial for customer trust.

## 4. Analytics (Privacy Focused)
*   **Plausible.io** or **Fathom**: These cost money but are privacy-centric.
*   **Google Analytics 4**: Free, but requires a cookie banner (which we included in the code).

## 5. Payments (Going Live)
*   The current site uses a **Simulation**. To take real money:
    1.  Sign up for **Stripe** (Credit Cards) and **Coinbase Commerce** (Crypto).
    2.  Replace the `UI.processPayment` mock function in `index.html` with the actual Stripe API Link or Checkout snippet.

## 6. Launch Checklist
- [ ] **Test Mobile View**: Open on iPhone/Android to ensure galleries stack correctly.
- [ ] **SEO Check**: Ensure `<title>` and `<meta description>` match your brand.
- [ ] **Legal**: Update the "Terms of Service" modal text with your real company details.
- [ ] **Speed**: Run the site through Google PageSpeed Insights.

## 7. Marketing (The "Moonshot")
*   **Instagram/Pinterest**: Create a "Mood Board" aesthetic.
*   **Influencers**: Use the Admin Panel to generate codes for art bloggers.
*   **Email**: Export your "Inner Circle" list from the Admin Panel and import into Mailchimp.
