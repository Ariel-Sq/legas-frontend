### Shipped

- V1.0.0 — Variations, Login (Google OAuth), withAuth guards, User Profile
  (editable, PATCH /api/users/me), Wishlist (backend-backed +
  sign-in modal for anon), Cart, Checkout (MercadoPago).
- V1.1.0 — i18n (full Spanish/voseo), Theme support (dark/light), Order
  history with 5-step paid lifecycle, Product Reviews (write + "Ya
  reseñaste" pill on /orders).
- V1.2.0 — Pagination + search on /shop, "Dejar reseña" CTA from order
  detail, WhatsApp post-purchase CTA.

### Open

- Cache Service / SWR layer.
- Palette picker analytics: track which base/accent combination users
  pick (today it only lives in each browser's localStorage) so we can
  learn the most-chosen palette and eventually make it the default.
  Cheapest path: send the choice to a tiny backend endpoint or a Vercel
  Analytics custom event on select.

- "Nosotros" (/about) is hidden from the nav and sitemap: its content is
  template boilerplate (fake "desde 1995", stock photos, invented stats).
  Write the real Legas story with Froid and bring the link back.

- Legal (pendiente de definición con Froid): publicar razón social y
  CUIT del proveedor en términos/footer (Res. 270/2020) y el QR de Data
  Fiscal F.960/D de ARCA en la home. Bloqueado hasta definir quién es el
  proveedor legal (¿Froid? ¿Sebastián? ¿Gonzalo?).

### Decisions

- No admin panel in the frontend, and no admin endpoints in the backend
  (they were removed). Admin operations (orders, products, reviews
  moderation, users) are done via chat (Claude) directly against the
  database.
