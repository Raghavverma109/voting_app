# 🗳️ Voting Application (Node.js + Express + MongoDB)

A backend voting application where users can vote for candidates using a unique Aadhar card number as their identity.

## 🔧 Features

- User Signup & Login (via Aadhar card number + password)
- JWT-based Authentication
- Admin user (can manage candidates, but **cannot** vote)
- Vote once functionality
- Live vote count and sorted result display
- Change user password
- Secure password storage and token handling

## 📁 Routes Overview

### User Auth
- `POST /signup` – Register user
- `POST /login` – Login with aadhar + password

### Voting
- `GET /candidates` – List all candidates
- `POST /vote/:candidateId` – Vote for a candidate

### Vote Count
- `GET /vote/counts` – Sorted live results

### User Profile
- `GET /profile` – View profile
- `PUT /profile/password` – Change password

### Admin Candidate Management
- `POST /candidates`
- `PUT /candidates/:id`
- `DELETE /candidates/:id`

## 👤 Admin Notes
- Only **one** admin allowed
- Admin cannot vote

## 📦 Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Bcrypt



Installation - 

Clone the repository: 

git clone https://github.com/Raghavverma109/voting_app

---

