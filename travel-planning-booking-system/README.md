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
npm run seed     # Populates sample destinations, hotels, activities, bookings, and trips
node src/server.js
```
*Backend runs on:* `http://localhost:5000`

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

---

## 🔑 Default Seeded Accounts

| Role | Email | Password | Direct Portal |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@travelease.com` | `Admin@123` | Lands directly in **Admin Command Center** (`/admin`) |
| **Standard User** | `user@travelease.com` | `User@123` | Lands in **User Travel Portal** (`/`) |

> *Tip: The login page includes 1-click test buttons to instantly fill admin or user credentials.*
