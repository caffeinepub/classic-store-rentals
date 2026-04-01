# Classic Store Rentals

## Current State
New project. Only scaffold files exist (empty Motoko actor, no frontend components).

## Requested Changes (Diff)

### Add
- Full landing page with sections: Hero, Products, Pricing, Booking Form, Contact, Footer
- Dark navy navbar with smooth scroll navigation
- Booking form that submits to backend (name, phone, equipment, start date, end date, delivery address)
- Admin panel (password-protected) to view all booking submissions
- Product & pricing management panel (admin only): add, edit, remove products with name, description, price/day
- Backend: bookings storage, products/pricing storage, admin password check

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend (Motoko):
   - Store products: id, name, description, pricePerDay (Nat), category
   - Store bookings: id, name, phone, equipment, startDate, endDate, address, timestamp
   - Admin login: hardcoded password check returning a session token
   - CRUD for products (admin only via token)
   - Query all bookings (admin only via token)
   - Public: get products, submit booking

2. Frontend:
   - Navbar: dark navy, logo, smooth scroll links, Admin link
   - Hero: full-width gradient, headline, CTA
   - Products section: 4-card grid (dynamic from backend)
   - Pricing section: 4-card grid (dynamic from backend)
   - Booking form: all fields, submits to backend
   - Contact section: phone, WhatsApp, email on gradient background
   - Footer
   - Admin panel route (/admin): password login, booking table, product/pricing CRUD
