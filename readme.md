# MERN Event Management System

A full-stack application to manage events across multiple profiles and timezones.

---

## ✅ Features
- Create profiles with individual timezones.
- Create events for one or multiple profiles.
- Store all times in **UTC** internally.
- Display events and logs in **viewer’s selected timezone**.
- Inline profile creation in multi-select.
- Event update logs with previous vs new values.

---

## ✅ Tech Stack
- **Frontend**: React + Vite + TailwindCSS + Zustand + Day.js
- **Backend**: Express.js + MongoDB (Mongoose)
- **Timezone Handling**: Day.js (`utc` + `timezone`)

---

## ✅ Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas or local MongoDB instance

---

## ✅ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/prabhattopi/event-management
cd event-management
```
## 2. Backend Setup
```bash
cd apps/server
npm install
npm run dev
```
## Create .env file:

```
PORT=5000
MONGODB_URI=your-mongodb-atlas-uri
CORS_ORIGIN=http://localhost:5173
```
## Run backend:

```
npm run dev
```


## 3. Frontend Setup
```bash
cd ../client
npm install
```
## Create .env file:

```
VITE_API_BASE_URL=http://localhost:5000
```
## Run frontend:

```
npm run dev
```

# Thankyou 



