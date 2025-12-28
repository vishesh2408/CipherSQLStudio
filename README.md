# CipherSQLStudio

CipherSQLStudio is an interactive full-stack web application designed to help users master SQL through hands-on practice. It features a curated list of challenges ranging from Basic SQL to Advanced Subqueries, all executed against a live PostgreSQL sandbox environment.

## 🚀 Features

- **Interactive SQL Editor**: Write, edit, and run SQL queries in real-time.
- **Live Sandbox**: Queries are executed against a real **PostgreSQL** database, providing accurate results and feedback.
- **Categorized Challenges**: Problems are organized by topic:
  - Basic SQL
  - Joins
  - Aggregation
  - Subqueries
  - Advanced
- **Responsive UI**: Built with a **Mobile-First** approach using **Vanilla SCSS**, ensuring a seamless experience on phones, tablets, and desktops.
- **Progress Tracking**: User progress is saved (MongoDB), allowing learners to solve problems at their own pace.
- **Authentication**: Secure Login and Signup functionality.

## 🛠 Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Vanilla SCSS (Sass)
  - Mobile-First Responsive Design (320px -> 1280px+)
  - BEM Naming Convention
  - Modular architecture (partials, mixins, variables)
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Databases**:
  - **MongoDB**: Stores assignment metadata (titles, questions, hints) and user data (profiles, progress).
  - **PostgreSQL**: Used as the ephemeral execution engine for user queries.

## ⚙️ Prerequisites

Ensure you have the following installed:
- **Node.js** (v14+)
- **MongoDB** (Local or Atlas)
- **PostgreSQL** (Local or hosted)

## 📦 Project Setup

### 1. Clone the Repository
```bash
# Clone using HTTPS
git clone https://github.com/vishesh2408/CipherSQLStudio.git

# Or using SSH
# git clone git@github.com:vishesh2408/CipherSQLStudio.git

cd CipherSQLStudio
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ciphersql
PG_URI=postgres://postgres:postgres@localhost:5432/ciphersql_sandbox
JWT_SECRET=your_super_secret_key_here
OPENAI_API_KEY=sk-your_openai_api_key_here  # Optional: Required for AI Hints
```
> **Note**: Ensure your PostgreSQL server is running and the database (e.g., `ciphersql_sandbox`) exists.

SEED the database (Required for first run):
```bash
# Populates MongoDB with challenges and sets up initial Postgres tables
node src/utils/seedData.js
```
*Output should show: "MongoDB Connected", "PostgreSQL Connected", "Database Seeded Successfully"*

Start the server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
# Frontend runs on http://localhost:5173 (usually)
```

## 📱 Responsive Design Breakpoints
The application style is built mobile-first, targeting these minimum widths:
- **Mobile**: Default (0px - 640px)
- **Tablet**: `641px` (`@include tablet`)
- **Desktop**: `1024px` (`@include desktop`)
- **Wide**: `1281px` (`@include wide`)

## 📂 Key Directory Structure

```
CipherSQLStudio/
├── backend/
│   ├── src/
│   │   ├── config/       # DB Connections
│   │   ├── models/       # Mongoose Schemas
│   │   ├── routes/       # API Routes (Auth, Assignments, Execution)
│   │   └── utils/        # Seed scripts, Helpers
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React Components
│   │   │   ├── pages/    # Page Views (Login, List, Attempt)
│   │   │   └── styles/   # SCSS Partials (_auth, _navbar, etc)
│   │   ├── context/      # Auth Context
│   │   └── services/     # API Axios instances
│   └── App.jsx
```

## 🤝 Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request