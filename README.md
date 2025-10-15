# 🗳️ Voting Application (Backend)  
A secure and robust **backend voting system** built with **Node.js**, **Express**, and **MongoDB**, where users can vote using their **Aadhar number** as a unique identifier.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens)

---

## 🔧 Features

- ✅ User Signup & Login via Aadhar number + password  
- 🔐 **JWT-based Authentication** for secure API access  
- 👤 **Admin role** for managing candidates (admin cannot vote)  
- 🗳️ **Vote-once only logic** for fairness  
- 📊 **Live vote count** with **sorted result view**  
- 🔒 Secure password hashing using **bcrypt**  
- 🔁 Change password functionality  
- 💾 MongoDB-based persistent storage

---

## 📁 API Routes Overview

### 🧑‍💼 User Authentication
- `POST /signup` – Register with Aadhar + password  
- `POST /login` – Login and receive JWT token  

### 🗳️ Voting
- `GET /candidates` – List all candidates  
- `POST /vote/:candidateId` – Cast a vote  

### 📊 Vote Results
- `GET /vote/counts` – Get **live**, **sorted** vote counts  

### 👤 User Profile
- `GET /profile` – View user profile  
- `PUT /profile/password` – Change password  

### 👑 Admin Candidate Management
- `POST /candidates` – Add new candidate  
- `PUT /candidates/:id` – Edit candidate details  
- `DELETE /candidates/:id` – Remove candidate  

---

## 👮 Admin Rules
- Only **one admin user** is allowed  
- Admin **cannot vote** to maintain neutrality

---

## 🧰 Tech Stack

# 🗳️ Voting App

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white)

One-liner: A simple, secure voting platform that allows registered users to cast a single vote for candidates, with admin tools to manage candidates and view live results.

## Project overview

This repository contains a full-stack voting application. The backend (in `/backend`) is built with Node.js, Express and MongoDB (via Mongoose). It provides user authentication using Aadhaar number and password, JWT-based authorization, candidate management for admins, and vote-casting endpoints that enforce a vote-once policy.

The frontend (in `/frontend`) is a React + Vite app styled with Tailwind CSS. It consumes the backend API to allow users to sign up, log in, view candidates, and cast votes. The frontend also includes admin UI to add, update and delete candidates and view results.

Live demo: Not deployed yet.

---

## Key features

- User signup & login using Aadhaar number + password (JWT authentication)
- Admin role (single admin allowed) to manage candidates (create/update/delete, upload images via Cloudinary)
- Vote once enforcement per user
- Vote counts with sorted results endpoint
- Password hashing with bcrypt and token-based auth with jsonwebtoken
- Candidate images uploaded to Cloudinary

---

## Screenshots / GIFs

- Homepage Screenshot: Shows landing page with candidate list and vote buttons.
- Admin Dashboard Screenshot: Shows candidate management UI (create, edit, delete).
- Results Screenshot: Shows bar chart or list of candidates sorted by votes.

(Add image URLs here or replace with real screenshots.)

---

## Technology stack

Frontend:

- React 18 (Vite)
- Tailwind CSS
- Axios

Backend:

- Node.js (CommonJS)
- Express 5
- Mongoose (MongoDB)
- multer (file uploads)
- Cloudinary for image storage
- jsonwebtoken (JWT) for auth
- bcrypt for password hashing

Database:

- MongoDB (Atlas or local)

Deployment (suggested):

- Frontend: Vercel / Netlify
- Backend: Render / Heroku / Railway

---

## API Endpoints

Base URL (local): http://localhost:5000 (backend default in examples)

Note: The backend mounts routes under `/user` and `/candidates` in `backend/server.js`.

Users (mounted at /user):

| Method | Endpoint | Description | Auth |
|---|---:|---|---:|
| POST | /user/signup | Register a new user. Body: user data (see env) | No |
| POST | /user/login | Login with { addharCardNumber, password } → returns JWT | No |
| GET | /user/profile | Get authenticated user's profile | Yes (Bearer token)
| PUT | /user/profile/password | Change password. Body: { currentPassword, newPassword } | Yes (Bearer token)

Candidates & Voting (mounted at /candidates):

| Method | Endpoint | Description | Auth |
|---|---:|---|---:|
| GET | /candidates/ | List all candidates (name, party, votes, image) | No |
| POST | /candidates/ | Create a candidate (multipart/form-data: image) | Yes (admin)
| PUT | /candidates/:candidateId | Update candidate (multipart/form-data optional image) | Yes (admin)
| DELETE | /candidates/:candidateId | Delete candidate | Yes (admin)
| POST | /candidates/vote/:candidateId | Cast a vote for a candidate | Yes (voter only)
| GET | /candidates/vote/count | Get vote counts (sorted desc) | No

Important details:

- Authentication: All protected routes expect an Authorization header with a Bearer token. The token is created with the `generateToken` helper in `backend/jwt.js` and verified by `jwtAuthMiddleware`.
- Admin role: Determined by the `role` field on the `User` model. Only users with `role: 'admin'` may create/update/delete candidates. Admins are prevented from voting by server-side checks.
- File uploads: Candidate images are uploaded with `multer` then forwarded to Cloudinary. The Cloudinary config reads `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` from environment variables.

---

## Local development & setup

Prerequisites:

- Node.js (v18+ recommended)
- npm (comes with Node.js) or yarn
- Git
- MongoDB (local or Atlas)
- Cloudinary account (optional, required to upload images)

### 1) Clone repository

```powershell
git clone https://github.com/Raghavverma109/voting_app.git
cd voting_app
```

### 2) Backend setup

```powershell
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Cloudinary (required if you want to upload candidate images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run the backend (example using nodemon if installed globally, or use npx):

```powershell
# using nodemon (recommended for development)
npx nodemon server.js

# or using node
node server.js
```

The server listens on `process.env.PORT` (default shown as 3030 in `server.js` if PORT not set). The frontend configuration uses `http://localhost:5000` by default — you can align these ports if desired.

### 3) Frontend setup

```powershell
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/` with the following variable (frontend reads `VITE_API_URL`):

```
VITE_API_URL=http://localhost:5000
```

Run the frontend dev server:

```powershell
npm run dev
```

Open the app in your browser (Vite will print the local dev URL, commonly `http://localhost:5173`).

---

## Environment variables summary

Backend (`backend/.env`):

- PORT — port to run the backend server (default: 3030 if not set)
- MONGO_URI — MongoDB connection string (required)
- JWT_SECRET — secret used to sign JWT tokens (required)
- CLOUDINARY_CLOUD_NAME — Cloudinary cloud name (optional for uploads)
- CLOUDINARY_API_KEY — Cloudinary API key (optional)
- CLOUDINARY_API_SECRET — Cloudinary API secret (optional)

Frontend (`frontend/.env`):

- VITE_API_URL — URL of the backend API (e.g., http://localhost:5000)

---

## Quick API examples (using curl)

Register a user:

```bash
curl -X POST http://localhost:5000/user/signup \
	-H "Content-Type: application/json" \
	-d '{"name":"Alice","age":30,"addharCardNumber":"123456789012","password":"pass123","phone":9999999999,"address":"Somewhere","dob":"1992-01-01","profilePhoto":"https://example.com/photo.jpg"}'
```

Login:

```bash
curl -X POST http://localhost:5000/user/login -H "Content-Type: application/json" -d '{"addharCardNumber":"123456789012","password":"pass123"}'
```

Get candidates:

```bash
curl http://localhost:5000/candidates/
```

Cast a vote (replace TOKEN and CANDIDATE_ID):

```bash
curl -X POST http://localhost:5000/candidates/vote/CANDIDATE_ID -H "Authorization: Bearer TOKEN"
```

---

## Author

Raghav Verma

GitHub: https://github.com/Raghavverma109

---

If you'd like, I can also:

- Add a short Postman collection for quick API testing.
- Add example .env.sample files inside `backend/` and `frontend/`.
- Add scripts in `backend/package.json` for `start` and `dev` (nodemon) if you want.

Completion summary: README updated to include project overview, tech stack badges, setup steps for backend and frontend, environment variables discovered in `backend/cloudinary.js` and `backend/db.js`, and API endpoints inferred from `backend/routes/*.js`.





