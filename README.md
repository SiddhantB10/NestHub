# NestHub — Student Hostel Accommodation Platform

A modern, full-stack web application to help NMIMS students in Mumbai discover, compare, and book hostel accommodations. Built with React, Tailwind CSS, Framer Motion, Node.js, Express, and MongoDB.

---

## Features

- **Hostel Search & Filter** — Browse 12+ verified hostels near NMIMS. Filter by budget, distance, gender, room type, and lease duration.
- **Detailed Hostel Pages** — View photos, room availability, food menus, travel cost estimates, facilities, house rules, and resident satisfaction scores.
- **Online Booking** — Select room type, upload documents, and confirm booking—or join a waitlist if rooms are full.
- **Student Dashboard** — View your current hostel info, submit maintenance requests, and track rent payments.
- **Parent Access Portal** — Parents can independently view safety info, hostel details, and accommodation status.
- **Admin Panel** — Manage hostels, bookings, maintenance requests, and room availability.
- **Multi-language** — Full English and Hindi support.
- **Animations** — Smooth page transitions, scroll reveals, and micro-interactions powered by Framer Motion.
- **Travel Cost Estimator** — Auto, bus, metro, and walking cost/time from any hostel to NMIMS campus.
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop.

---

## Tech Stack

| Layer     | Technology                                     |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion     |
| Icons     | Lucide React                                     |
| Backend   | Node.js, Express                                 |
| Database  | MongoDB, Mongoose                                |
| Auth      | JWT, bcryptjs                                    |

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (optional — the frontend runs standalone with embedded demo data)

### Installation

```bash
# Clone the repo (or open the project folder)
cd StayNMIMS

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Frontend (standalone, no backend needed)

```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser. The app works fully with built-in demo data.

### Running Backend + Frontend (full stack)

**Terminal 1 — Backend:**
```bash
cd backend
# Create a .env file with your MongoDB URI (see .env.example)
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

### Seeding the Database (optional)

```bash
cd backend
node seed/seed.js
```

This populates MongoDB with 12 hostels and an admin user.

---

## Demo Accounts

| Role    | Email                     | Password    |
|---------|---------------------------|-------------|
| Student | arjun.mehta@nmims.edu     | (any text)  |
| Admin   | admin@nesthub.com         | (any text)  |
| Parent  | Use "For Parents" page    | Code: STAY2025 |

---

## Project Structure

```
StayNMIMS/
├── backend/
│   ├── config/          # Database connection
│   ├── middleware/       # JWT auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── seed/            # Seed data and script
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable UI, layout, and hostel components
│       ├── context/     # React contexts (Auth, Language, Toast)
│       ├── data/        # Hostel data, translations
│       ├── pages/       # 7 page components
│       └── utils/       # API helpers, travel cost calculator
└── README.md
```

---

## Pages

1. **Landing** — Hero, stats, how-it-works, featured hostels, features, testimonials
2. **Hostel Listing** — Search, filter sidebar, sort, grid of hostel cards
3. **Hostel Detail** — Gallery, room availability, food menu, policies, travel estimator, map
4. **Booking** — Room selection, date picker, document upload, confirmation
5. **Dashboard** — Current hostel, maintenance requests, rent payments
6. **Parent Access** — Parent login, student info, safety details, accommodation status
7. **Admin Panel** — Overview stats, hostel CRUD, booking management, maintenance management

---

Built for NMIMS students, by students.
