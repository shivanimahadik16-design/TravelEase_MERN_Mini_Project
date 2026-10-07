# TravelEase — MERN Travel Planning and Booking System

A full-stack MERN travel planning and reservation system featuring **completely separate, dedicated interfaces** for consumers and administrators.

---

## 🎨 Dual-Interface Architecture

### 1. 🏖️ Customer / User Portal (`http://localhost:5173/`)
- **Aesthetic**: Light, modern, vibrant oceanic travel theme with translucent glassmorphic navigation and card elevations.
- **Dedicated Components**:
  - **Travel Navbar**: Brand identity, exploration links, user profile chip, and a prominent `🛡️ Admin Console →` badge for administrators.
  - **Homepage & Hero**: Live keyword, destination, and tag search with instant filters (`#beach`, `#mountains`, `#heritage`, etc.).
  - **Destinations Showcase**: Destination cards with season recommendations, tags, and detail view.
  - **Stays & Accommodations**: Real-time room availability counters, amenities tags, and instant booking modal.
  - **Outdoor Tours & Activities**: Duration badges, per-person rates, and direct booking flow.
  - **Smart Itinerary Planner (My Trips)**: Interactive day-by-day travel timeline builder.
  - **My Bookings**: Reserved properties and tours with live status pills (`Confirmed` in green, `Cancelled` in red) and cancellation actions.
  - **Travel Footer**: Brand navigation and copyright.

---

### 2. 🛡️ Admin Command Center (`http://localhost:5173/admin`)
- **Aesthetic**: Sleek Dark Slate / Executive Command Center (`#090d16`, `#0f172a`, `#1e293b`) with distinct enterprise controls and zero consumer clutter.
- **Dedicated Components**:
  - **Left Fixed Sidebar**: Admin avatar, online system badge, navigation links, quick `🌐 Switch to User View` button, and `Sign Out`.
  - **Admin Topbar**: Breadcrumb trail, system health indicator, and storefront link.
  - **Dashboard Overview (`/admin`)**: Real-time KPI statistics (Total Revenue ₹, All Bookings, Destinations, Hotels, Activities, Registered Users) and Latest Bookings feed.
  - **Destinations Management (`/admin/destinations`)**: High-density data table, search filter, image previews, and Add/Edit modals (`POST` & `PUT /destinations`).
  - **Hotels Management (`/admin/hotels`)**: Room inventory manager, price per night, amenities chips, and Add/Edit modals (`POST` & `PUT /hotels`).
  - **Activities Management (`/admin/activities`)**: Outdoor excursion scheduler, duration and ticket fee manager, and Add/Edit modals (`POST` & `PUT /activities`).
  - **Central Bookings Dispatch (`/admin/bookings`)**: Platform-wide reservations directory with customer search, status filters (Confirmed/Cancelled), and cancellation/reconfirmation controls.
  - **Users Directory (`/admin/users`)**: Registered accounts list with role badges (`Super Admin` vs `User`) and join dates.

---

## 🚀 Running the Project

### Requirements
- Node.js 18+
- Local MongoDB running on `mongodb://127.0.0.1:27017` or MongoDB Atlas string in `.env`

### 1. Start the Backend Server
```bash
cd server
npm install
npm run seed     # Safely adds sample catalog data without deleting saved users or bookings
npm run dev
```
*Backend runs on:* `http://localhost:5000`

The default seeded administrator login is `admin@travelease.com` with password `admin123`. Running the seed script creates or resets that account; set `SEED_ADMIN_EMAIL` in `server/.env` to use a different email. Change the password after signing in, and do not use this development password in production. To also create a sample traveler account, set `SEED_USER_NAME`, `SEED_USER_EMAIL`, and `SEED_USER_PASSWORD`. Keep these values private and do not commit `.env`.

Seeding is safe to run again: it never deletes users, bookings, or trips. It resets the seeded administrator's password to `admin123`, but does not overwrite an existing sample traveler's password. It adds the sample catalog and sample bookings/trip only when the catalog is empty. New user registrations and bookings are stored in MongoDB; normal server restarts do not run the seed script.

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

The customer portal and admin command center use separate layouts. Users can register and sign in through the customer portal; administrators are routed to `/admin` after signing in. Signed-in users and administrators can change their password from the customer navigation or admin sidebar; the current password is required. The admin user directory lists seeded and subsequently registered accounts, while the bookings directory displays saved reservations.

## Local validation and error handling

The frontend uses required fields and browser input constraints, and the Express API validates request bodies, query parameters, and resource IDs with Joi. API errors pass through centralized middleware and use a consistent JSON response containing `success: false` and a readable `message`; validation responses can also include field-level `details`.

These features run locally with the project dependencies and do not require a paid service. Cloud deployment is not part of this setup.
