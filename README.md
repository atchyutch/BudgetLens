# BudgetLens
A full-stack personal–finance web app that securely links bank accounts via Plaid, categorizes expenses with Fuse.js, and sends real-time overspend alerts with EmailJS to help students and early professionals visualize and control their spending.


# Features
Secure bank account linking and real‑time transaction fetching via Plaid API
Smart expense categorization with Fuse.js
Instant overspend alerts via EmailJS
Interactive Recharts analytics:Pie charts
Role‑based access, JWT authentication, AES‑256 data encryption

# Tech Stack
Frontend: React 19, Vite, Tailwind CSS, Recharts, Fuse.js, EmailJS
Backend: Node.js, Express, MySQL 8, Plaid API, JWT

# Prerequisites
Node.js (v18+), npm or yarn
MySQL
Plaid account (client ID, secret)
EmailJS credentials

# Installation and Setup
# Clone project
git clone https://github.com//BudgetLens.git
cd BudgetLens

# Copy example env file and fill in your secrets
cp .env.example .env

# Install backend dependencies
cd server
npm install

# Start backend server
cd server
npm run dev  # or node src/app.js

# Start Frontend Server
cd client-side
npm install
npm run dev

# Env Variables
PORT=5500
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=budget_lens
JWT_SECRET=supersecretjwt
PLAID_CLIENT_ID=pk_sandbox_...
PLAID_SECRET=sk_sandbox_...
PLAID_ENV=sandbox
CORS_ORIGIN=http://localhost:5173
SENDGRID_API_KEY=SG.xxxxxx


