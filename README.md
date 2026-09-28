# 🌿 FarmFresh - Direct Farm-to-Customer Marketplace

A modern, production-ready, mobile-first farm-to-customer marketplace web application built with **React (JavaScript)** and **Tailwind CSS v4**. 

This application connects urban consumers directly with rural farming families, eliminating brokers to guarantee organic freshness for buyers and fair wages for local agricultural producers. The project spotlights **Anugu Organic Farms** (a multi-generational family orchard in Chittoor, AP) as a key partner farm.

---

## 🚀 Key Features (Resume Worthy)

### 👥 Dual-User Dashboards & Roles
- **Customer Experience**: Complete checkout journey including category browsing, search indexes, dynamic quantity additions, simulated wallet balance checks, and a social-impact "Farmer Tip" panel.
- **Farmer Portal**: Dedicated dashboard where partners can view their total earnings, list new organic harvest produce (with auto-selected stock pictures or custom URLs), and manage fulfillment order queues.
- **Instant Role Switcher**: A quick-switch role pill integrated at the top of the header, allowing interviewers to toggle between Customer and Farmer views instantly without re-logging in.

### 📦 Persistent Local-Storage State
- Uses React Context Providers (`AuthProvider` and `CartContext`) to persist active sessions, cart states, newly created products, and order timelines in the browser's `localStorage`.
- Actions in one role (e.g., placing an order as Rohan) dynamically propagate to the other (e.g., showing up in Ramesh Anugu's farmer dashboard for harvesting and delivery progress updates).

### 📍 Real-Time Order Stepper
- An interactive visual timeline tracking fulfillment steps: **Placed &amp; Routed** ➡️ **Harvesting (Plucking)** ➡️ **Sorted &amp; Packed** ➡️ **Out for Delivery** ➡️ **Delivered**.
- Farmers can advance order states, instantly updating the customer's order tracker.

### 🍃 Sustainable Design Standards
- Premium green-farm visual theme using HSL tailwind emerald and sage palettes.
- Mobile-first layouts with smooth sliding navigations and Framer Motion micro-animations.

---

## 📂 Project Architecture

```text
farmfresh/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── dashboard/      # Farmer dashboards & list controllers
│   │   └── ui/             # Reusable cards, buttons, badges
│   ├── context/            # AuthContext & CartContext (Simulated State engines)
│   ├── data/               # Seed product catalog & category indexes
│   ├── layouts/            # RootLayout (Navbar header, Footer layout)
│   ├── pages/              # Routing pages (Home, Shop, Details, Cart, Auth, Orders, etc.)
│   ├── App.css             # blank overrides
│   ├── App.jsx             # React router mapping
│   ├── index.css           # Tailwind v4 imports & custom animations
│   └── main.jsx            # strict mode render mounts
├── vite.config.js          # Tailwind v4 plugin settings
├── package.json            # dependency declarations
└── README.md               # project documentation
```

---

## 🛠️ Technology Stack

- **Framework**: React.js (built on Vite tooling)
- **Styling**: Tailwind CSS v4.0.0 (using standard `@theme` declarations)
- **Navigation Routing**: React Router v7 (`react-router-dom`)
- **Micro-Animations**: Framer Motion
- **Icons**: Lucide React

---

## 💻 Local Setup & Execution

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to interact with the application.

3. **Production Compilation Bundle**:
   ```bash
   npm run build
   ```

---

## 🔒 Demo Credentials (For Quick Testing)

To test the dual flows instantly, click the quick-login credentials at the bottom of the **Login Page**:
- **Test Customer**: Rohan Sharma (`rohan@gmail.com`)
  - *Actions*: Browse mangoes, adjust cart, check out with ₹750 wallet balance, track order timeline.
- **Test Farmer**: Ramesh Anugu (`ramesh@anugufarms.com` - Anugu Organic Farms)
  - *Actions*: Add mango or grain listings, review orders received, advance harvest and delivery status, check total earnings.
