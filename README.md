# 🌿 FarmFresh - Direct Farm-to-Customer Marketplace

A modern, full-stack, production-ready, mobile-first farm-to-customer marketplace web application built with **React (JavaScript)**, **Tailwind CSS v4**, and a robust **Python Flask REST API** backed by **SQLAlchemy** and **Razorpay Payment Gateway**.

This application connects urban consumers directly with rural farming families, eliminating brokers to guarantee organic freshness for buyers and fair wages for local agricultural producers. The platform spotlights **Anugu Organic Farms** (Chittoor, AP) and **Reddy Organic Farms** (Jagtial, TS) as partner agricultural producers.

---

## 🚀 Key Features & Architectural Upgrades

### 🔐 Multi-Tenant JWT Authentication & Security
- **Dynamic Registration & Login**: Supports multi-tenant user accounts with role-based access (`customer` or `farmer`).
- **Secure Password Hashing**: Powered by `werkzeug.security` (`generate_password_hash` & `check_password_hash`).
- **Persistent Session Hydration**: Automatically hydrates active user sessions on startup via `GET /api/auth/me` with Bearer token authentication.
- **`authFetch` Interceptor**: Custom fetch wrapper that automatically attaches `Authorization: Bearer <token>` headers to all protected API calls.

### ✨ Modern `AuthModal` Component
- **Backdrop Blur Modal**: Responsive popup modal with smooth Framer Motion micro-animations.
- **Tab 1: Sign In**:
  - Email & Password fields.
  - **1-Click Test Credentials**:
    - 🛒 **Demo Customer**: Instant login as `rohan@gmail.com` / `password123`.
    - 👨‍🌾 **Demo Farmer**: Instant login as `ramesh@anugufarms.com` / `password123`.
- **Tab 2: Create Account**:
  - **Segmented Role Selector**: Switch between *"Shop Fresh Produce"* (`role: customer`) and *"Sell Harvest as Farmer"* (`role: farmer`).
  - Standard fields: Full Name, Email, Password.
  - Conditional inputs (visible ONLY for Farmers): **Farm Name** and **Farm Location**.

### 🌾 Strict Multi-Tenant Data Scoping & Multi-Vendor Isolation
- **Farmer Portal Scoping**:
  - `GET /api/products/farmer`: Returns harvest listings strictly owned by `Product.farmer_id == g.current_user.id`.
  - `POST /api/products/`: Automatically binds `farmer_id` from the decoded JWT identity.
  - `GET /api/orders/farmer-summary`: Calculates total revenue, pending harvest queues, and customer order items strictly for the active farmer's produce.
- **Customer Portal Scoping**:
  - `/api/cart/` and `/api/orders/` bind strictly to `current_user.id`.
  - **Guest Browsing Fallback**: Unauthenticated users can freely browse produce; attempting to add to cart or proceed to checkout automatically prompts `AuthModal`.

### 💳 Razorpay Payment Gateway Integration & Receipts
- **Checkout Flow**: Complete Razorpay order creation (`/api/payments/razorpay/order`) and HMAC-SHA256 signature verification (`/api/payments/razorpay/verify`).
- **Printable Receipts**: Dynamically generated HTML payment receipts accessible via `/api/payments/receipt/<order_id>`.

### 👥 Dynamic Navigation & Role-Switcher Polish
- Responsive header navigation adapts dynamically based on session role:
  - **Partner Farmers**: Mode switcher pill toggles between `"🌾 Farmer Dashboard"` and `"🛒 Buyer Mode"`.
  - **Customers**: Displays `"Become a Farmer"` action button opening farm registration.
  - **Logged-Out Users**: Displays clean `"Sign In"` button triggering `AuthModal`.

### 📍 Real-Time Order Stepper & Social Impact
- Visual 5-stage fulfillment timeline: **Placed & Routed** ➡️ **Harvesting (Plucking)** ➡️ **Sorted & Packed** ➡️ **Out for Delivery** ➡️ **Delivered**.
- Voluntary **Farmer Tip** panel supporting local water irrigation and seed sourcing.

---

## 📂 Project Architecture

```text
farmfresh/
├── backend/                        # Python Flask REST API
│   ├── app/
│   │   ├── database/               # Database initialization & seeding scripts
│   │   │   ├── __init__.py
│   │   │   └── seed.py             # Multi-vendor demo accounts & harvest seeding
│   │   ├── models/                 # SQLAlchemy ORM Data Models
│   │   │   ├── user.py             # User model with Werkzeug hashing & properties
│   │   │   ├── product.py          # Crop product model & farmer ForeignKeys
│   │   │   ├── order.py            # Order & OrderItem models
│   │   │   ├── cart.py             # Cart & CartItem models
│   │   │   ├── payment.py          # Razorpay transaction log model
│   │   │   └── category.py         # Category indexes
│   │   ├── routes/                 # REST API Blueprints
│   │   │   ├── auth.py             # /api/auth (register, login, me, profile)
│   │   │   ├── products.py         # /api/products (catalog & farmer scoping)
│   │   │   ├── cart.py             # /api/cart (customer cart operations)
│   │   │   ├── orders.py           # /api/orders (checkout & farmer summary)
│   │   │   └── payments.py         # /api/payments (Razorpay order, verify & receipts)
│   │   ├── schemas/                # Input validation logic
│   │   └── services/               # JWT auth middleware & token service
│   ├── instance/                   # SQLite database storage (farmfresh.db)
│   ├── requirements.txt            # Python backend dependencies
│   └── run.py                      # Flask server application entry point
│
├── src/                            # React 19 Frontend (Vite)
│   ├── components/
│   │   ├── dashboard/              # Farmer management panels & controls
│   │   └── ui/                     # Reusable UI cards, badges & AuthModal.jsx
│   ├── context/
│   │   ├── AuthContext.jsx         # Global auth state, session hydration & authFetch
│   │   └── CartContext.jsx         # Cart state & guest auth triggers
│   ├── layouts/
│   │   └── RootLayout.jsx          # Dynamic navigation header & AuthModal mounting
│   ├── pages/                      # Application route pages
│   │   ├── Home.jsx                # Landing page & spotlight farm highlights
│   │   ├── Products.jsx            # Catalog browsing, search & category filters
│   │   ├── Cart.jsx                # Cart checkout & Razorpay payment integration
│   │   ├── Profile.jsx             # User dashboard & Farmer harvest management
│   │   ├── Orders.jsx              # Customer order tracker stepper
│   │   ├── Login.jsx & Signup.jsx  # Dedicated authentication pages
│   │   └── About.jsx & Contact.jsx # Farm story & contact forms
│   ├── App.jsx                     # React Router mapping
│   ├── index.css                   # Tailwind v4 theme declarations
│   └── main.jsx                    # Root application mounting
├── vite.config.js                  # Vite build configuration
└── package.json                    # Node.js dependencies & scripts
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite tooling)
- **Styling**: Tailwind CSS v4.0.0
- **Routing**: React Router v7 (`react-router-dom`)
- **Micro-Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: Python Flask 3.0
- **ORM & Database**: Flask-SQLAlchemy (SQLite / PostgreSQL ready)
- **Security**: Werkzeug Security (`generate_password_hash`, `check_password_hash`)
- **Authentication**: PyJWT (JSON Web Tokens)
- **Payments**: Razorpay Python SDK
- **CORS**: Flask-CORS

---

## 💻 Local Setup & Execution

### 1. Backend Server Setup (Flask API)
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run Flask server (starts on http://localhost:5000)
python run.py
```
*Note: On first startup, `run.py` automatically creates the database schema and seeds multi-vendor demo accounts & harvests.*

### 2. Frontend Application Setup (Vite React)
```bash
# In the root project directory, install Node dependencies
npm install

# Run Vite development server (starts on http://localhost:5173)
npm run dev
```

### 3. Production Compilation Bundle
```bash
npm run build
```

---

## 🔒 Demo Credentials (For Instant Testing)

Click the **1-Click Demo Buttons** inside the `AuthModal` or use the credentials below:

- 🛒 **Test Customer**: `rohan@gmail.com` / `password123` (**Rohan Sharma**)
  - *Capabilities*: Browse catalog, manage basket, check out via Razorpay/Wallet, view live fulfillment stepper.
- 👨‍🌾 **Test Farmer 1**: `ramesh@anugufarms.com` / `password123` (**Ramesh Anugu - Anugu Organic Farms, Chittoor, AP**)
  - *Capabilities*: View isolated Ramesh harvest listings (Banganapalle Mangoes, Tender Coconut), list new crops, review incoming order queues, check total earnings.
- 👨‍🌾 **Test Farmer 2**: `thirupathi@reddyfarms.com` / `password123` (**Thirupathi Reddy - Reddy Organic Farms, Jagtial, TS**)
  - *Capabilities*: View isolated Thirupathi harvest listings (Turmeric, Sona Masuri Rice, Dals), manage stock, track earnings.
