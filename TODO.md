### V1.0.0 - Initial Release

- Create Variation
- Add Product Image
- Login
- withAuth guard
- User Profile
- Wishlist
- Cart
- Checkout

### V1.1.0 - Major Update

- i18n
- Theme Support
- Compare Products
- Cache Service
- Order History
- Product Reviews

### V1.2.0 - UX Improvements

- Search Functionality
- Pagination
- "Dejar reseña" CTA on each order item in /orders for completed/delivered
  orders. Should open the same review form already used in
  components/product-reviews.tsx (or a small modal version of it) and
  POST to /api/reviews with productVariationId from order.items[i].
  Skip the CTA when status is still pending/processing, and hide it for
  variations the same user already reviewed (the backend rejects with
  409 anyway, but the UI shouldn't tempt the click).
