# ✈️ Travel Budget Tracker

A full-stack web application for managing trips and tracking travel expenses. Built for the System Analysis and Design course — Spring 2026.

---

## 📋 Project Overview

Travel Budget Tracker allows you to:
- Create and manage trips (destination, dates, budget, currency)
- Log expenses for each trip by category (Food, Hotel, Transport, etc.)
- Monitor how much you've spent vs. your budget
- Search trips by name, destination, or country

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | SQLite (via sql.js) |
| API Docs | Swagger UI |
| Frontend | Vanilla JavaScript (SPA) |
| Testing | Jest |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/alialmustafa233/travel-budget-tracker.git
cd travel-budget-tracker
```

2. **Install dependencies**
```bash
cd backend
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Open the app**

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📄 API Documentation

Swagger UI is available at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Endpoints Summary

#### Trips
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/trips | Get all trips (supports ?search=) |
| GET | /api/trips/:id | Get trip by ID |
| POST | /api/trips | Create a new trip |
| PUT | /api/trips/:id | Update a trip |
| DELETE | /api/trips/:id | Delete a trip |

#### Expenses
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/trips/:tripId/expenses | Get all expenses for a trip |
| GET | /api/trips/:tripId/summary | Get budget summary for a trip |
| POST | /api/expenses | Create a new expense |
| PUT | /api/expenses/:id | Update an expense |
| DELETE | /api/expenses/:id | Delete an expense |

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Tests cover all business logic validation functions in `services/tripService.js` and `services/expenseService.js`.

---

## 📁 Project Structure

```
travel-budget-tracker/
├── backend/
│   ├── db/
│   │   └── database.js       # SQLite setup
│   ├── routes/
│   │   ├── trips.js          # Trip routes
│   │   └── expenses.js       # Expense routes
│   ├── services/
│   │   ├── tripService.js    # Trip business logic
│   │   └── expenseService.js # Expense business logic
│   ├── tests/
│   │   └── services.test.js  # Unit tests
│   ├── server.js             # App entry point
│   └── package.json
└── frontend/
    └── index.html            # Single-page app
```

---

## ✅ Features Checklist

- [x] Full CRUD for Trips
- [x] Full CRUD for Expenses
- [x] Search/filter trips
- [x] Budget progress tracking
- [x] Category-based expense tracking
- [x] Input validation (frontend + backend)
- [x] RESTful API with proper HTTP methods and status codes
- [x] Swagger/OpenAPI documentation
- [x] Unit tests for business logic
- [x] Single-page application (vanilla JS, no frameworks)
- [x] Version controlled with Git

---

## 👨‍💻 Author

Made for System Analysis and Design — Spring 2026
