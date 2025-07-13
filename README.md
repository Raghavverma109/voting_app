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

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT (jsonwebtoken), bcrypt  
- **Security:** Password hashing, token auth

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Raghavverma109/voting_app
cd voting_app

### 2. Install Dependencies

```bash
npm install

### 3. Create a .env file
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

### 4. Run the Server
```bash
npm start





