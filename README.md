# 🗳️ VoteSafe - Secure MERN Stack Voting Application

<div align="center">

[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Leaflet](https://img.shields.io/badge/React_Leaflet-1EB300?logo=leaflet&logoColor=white)](https://react-leaflet.js.org/)
[![Recharts](https://img.shields.io/badge/Recharts-blue?logo=recharts)](https://recharts.org/)

**A secure, full-stack online voting platform built with the MERN stack, featuring role-based access, live election results with real-time polling, geographical data visualization, and a comprehensive admin panel.**

[**Live Demo**](https://votesafe.vercel.app) || [**Portfolio**](https://raghavverma.vercel.app/)

</div>

---

## 📖 Overview

VoteSafe is a modern, full-stack voting application designed to provide a secure, transparent, and user-friendly experience for online elections. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), it incorporates JWT-based authentication, role-based access control, and detailed user profiles based on realistic parameters.

Key features include a dedicated admin panel for managing elections and candidates, a live results dashboard with real-time polling and chart visualizations, and an interactive geographical map view displaying results by state.

---

## ✨ Features

### Voter Features
- ✅ **Secure Signup & Login:** User registration and authentication using unique Aadhaar number and password.
- 👤 **Detailed User Profiles:** Includes fields like Name, DOB, Sex, Relative Info, Address (City, State, Pincode), and Live Photo Capture.
- 🔐 **JWT Authentication:** Secure access to protected routes and actions.
- 🗳️ **Election Dashboard:** View upcoming, live, and past elections.
- 👆 **One Vote Per Election:** Server-side validation ensures each user can vote only once per election. Age verification (18+) is enforced.
- 📈 **Live Results Page:** View real-time vote counts for ongoing elections, updated automatically every 3 seconds with animated charts (`Recharts`).
- 🗺️ **Map Results Page:** Visualize election results geographically on an interactive map of India (`React Leaflet`), colored by the winning party in each state. Popups show detailed vote breakdown.
- ⚙️ **Profile Management:** Users can view their profile details and change their password.
- 📱 **Responsive Design:** Fully functional and visually appealing on desktop, tablet, and mobile devices.

### Admin Features
- 👑 **Role-Based Access:** Dedicated admin functionalities protected by JWT and role checks.
- ⚙️ **Admin Dashboard:** Central hub with navigation to manage different aspects of the application.
- ➕ **Candidate Management:** Full CRUD operations (Create, Read, Update, Delete) for candidates/parties, including image uploads via Cloudinary.
- 🗓️ **Election Management:** Full CRUD operations for elections (Create, Read, Update, Delete), including selecting participating candidates.
- 📊 **Audit History:** View a list of past elections and access detailed audit logs showing which verified users participated in each election (maintaining vote secrecy). Includes search functionality.
- 🚫 **Admin Cannot Vote:** Enforced separation of duties; admins cannot participate in voting.

---

## 📸 Screenshots

Here's a glimpse of the VoteSafe application:

---

### Home Page
_Modern landing page with application overview and call-to-action buttons._
 <img width="1915" height="873" alt="image" src="https://github.com/user-attachments/assets/0f275495-79ef-44f7-944a-9f90a415e89f" />
 
---

### Signup Page
_User registration form with detailed fields, Aadhaar QR scan option (optional), and live photo capture._
<img width="1482" height="865" alt="image" src="https://github.com/user-attachments/assets/c369af5f-cb08-4212-bce7-c8456e1473a9" />

---

### Login Page
_Secure login interface using Aadhaar number and password._
<img width="1555" height="855" alt="image" src="https://github.com/user-attachments/assets/836e39f8-a7c5-4d5f-aa5c-3a1e0fbe4190" />

---

### User Dashboard
_Displays upcoming, live, and past elections. Allows users to select a live election to vote._
<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/aaf69424-4f87-4f0b-93d2-6f172ba20034" />

---

### Voting Panel
_Interface for selecting a candidate and casting a vote within a live election._
<img width="1203" height="785" alt="image" src="https://github.com/user-attachments/assets/97e2cf5b-e259-4887-b497-0e3f0dc1cfd2" />

---
### Past Results Page
_Shows all-past vote counts for the election using animated charts
<img width="1112" height="762" alt="image" src="https://github.com/user-attachments/assets/8f5127c1-bd56-41d8-a9db-67a1089621fd" />
<img width="983" height="808" alt="image" src="https://github.com/user-attachments/assets/022878dc-2919-4220-832e-ecb927da0317" />


---

### Live Results Page
_Shows real-time vote counts for the currently active election using animated charts (updates every 3 seconds)._
<img width="1201" height="516" alt="image" src="https://github.com/user-attachments/assets/c17cf786-82b2-4685-9a2a-29c7f0bf9d33" />


---

### Map Results Page
_Interactive geographical map visualizing election results by state using colored overlays. Clickable popups show detailed vote breakdown._
<img width="1441" height="843" alt="image" src="https://github.com/user-attachments/assets/15d0804f-11d8-417e-acb7-82626deefcc6" />
<img width="1353" height="770" alt="image" src="https://github.com/user-attachments/assets/01a0a0df-0a5b-4ba8-bf80-550e71c8bf06" />


---

### Admin Panel Hub
_Central navigation dashboard for administrators._
<img width="1710" height="712" alt="image" src="https://github.com/user-attachments/assets/a9cefc34-36ac-49a1-ab86-dc403a3223b2" />

---

### Admin - Manage Parties/Candidates
_Interface for admins to add, edit, view, and delete candidates/parties, including image uploads._
<img width="1039" height="737" alt="image" src="https://github.com/user-attachments/assets/59e0530c-aef4-4547-9556-4fdd8e2bb583" />

---

### Admin - Manage Elections
_Interface for admins to create, edit, view, and delete elections._
<img width="1189" height="658" alt="image" src="https://github.com/user-attachments/assets/b2310ef1-d4e4-4b84-a7f0-61253a1988bf" />

---

### Admin - Audit History
_List view for admins to select past elections for auditing voter participation._
<img width="1208" height="750" alt="image" src="https://github.com/user-attachments/assets/639c089a-2596-48ce-a8f9-6bd6b6e8ff8f" />

---

### Admin - Audit Detail
_Detailed view showing the list of verified users who participated in a specific past election (maintains vote secrecy). Includes search functionality._
<img width="1070" height="744" alt="image" src="https://github.com/user-attachments/assets/1d78a891-51c0-402f-b376-498408e6636a" />

---

### User Profile Page
_Displays the logged-in user's details and provides an interface to change their password._
<img width="1673" height="860" alt="image" src="https://github.com/user-attachments/assets/48e86557-d463-4fe5-b9c4-23ca19758af8" />

---
## 🛠️ Technology Stack

| Category         | Technologies                                                                 |
| ---------------- | ---------------------------------------------------------------------------- |
| **Frontend** | React 18, Vite, React Router, Tailwind CSS, Axios, React Hot Toast, Lucide React |
| **Backend** | Node.js, Express.js                                                          |
| **Database** | MongoDB, Mongoose                                                            |
| **Authentication**| JSON Web Tokens (JWT), bcrypt                                                |
| **File Storage** | Cloudinary (for images)                                                     |
| **Mapping** | React Leaflet, Leaflet                                                       |
| **Charting** | Recharts                                                                     |
| **Deployment** | Vercel (Frontend), Render (Backend & DB)                                     |

---

## 📋 Prerequisites

- Node.js (v18.x or higher recommended)
- npm or yarn
- Git
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account (optional, for image uploads)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Raghavverma109/voting_app.git
cd voting_app
```

### 2. Backend Setup (`/backend`)

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000

# Database Connection (replace with your MongoDB Atlas or local URI)
MONGO_URI=your_mongodb_connection_string

# JWT Secret (use a strong, random string)
JWT_SECRET=your_super_strong_random_jwt_secret

# Frontend URL for CORS (replace with your Vercel or dev URL)
VITE_Frontend_URL=http://localhost:5173 

# Cloudinary Configuration (optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
*(Create a `.env.example` file mirroring this structure)*

Start the backend server:

```bash
npm start 
# Or for development with auto-restart: npm run dev (if you have nodemon configured)
```
The backend API will be available at `http://localhost:5000`.

### 3. Frontend Setup (`/frontend`)

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL (must start with VITE_)
VITE_BackendURL=http://localhost:5000 
```
*(Create a `.env.example` file mirroring this structure)*

Start the frontend development server:

```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📚 API Endpoints Summary

*(Note: Protected routes require `Authorization: Bearer <token>` header)*

### User Routes (`/user`)
- `POST /signup`: Register a new user.
- `POST /login`: Authenticate and receive JWT.
- `GET /profile`: Get logged-in user's profile (Protected).
- `PUT /profile/password`: Change user's password (Protected).

### Election Routes (`/elections`)
- `GET /`: Get all elections.
- `POST /add`: Create a new election (Admin Only).
- `GET /:electionId`: Get details of a specific election.
- `PATCH /:electionId`: Update an election (Admin Only).
- `DELETE /:electionId`: Delete an election (Admin Only).
- `POST /:electionId/vote`: Cast a vote (Voter Only, Age >= 18).
- `GET /current`: Get the election happening today (if any).
- `GET /results`: Get results of all past elections.
- `GET /:electionId/audit`: Get audit details for an election (Admin Only).
- `GET /:electionId/map-results`: Get aggregated results by state for the map.

### Candidate Routes (`/candidates`)
- `GET /`: Get all candidates.
- `POST /`: Create a new candidate (Admin Only, `multipart/form-data`).
- `PUT /:candidateId`: Update a candidate (Admin Only, `multipart/form-data`).
- `DELETE /:candidateId`: Delete a candidate (Admin Only).

---

## 📁 Project Structure

```text
voting_app/
├── backend/
│   ├── middleware/       # JWT auth (jwtAuthMiddleware, adminCheck)
│   ├── models/           # Mongoose schemas (User, Election, Candidate)
│   ├── node_modules/     # (Omitted - Dependencies)
│   ├── routes/           # API route handlers (userRoutes, electionRoutes, candidateRoutes)
│   ├── uploads/          # (Potentially for temporary file uploads if using multer diskStorage)
│   ├── .env              # Server environment variables
│   ├── .gitignore        # Git ignore rules
│   ├── cloudinary.js     # Cloudinary configuration utility
│   ├── db.js             # MongoDB connection setup
│   ├── JWT.js            # JWT generation & verification utilities
│   ├── package-lock.json # (Omitted - Lockfile)
│   ├── package.json      # Backend dependencies and scripts
│   └── server.js         # Express app entry point
│
├── frontend/
    ├── node_modules/     # (Omitted - Dependencies)
    ├── public/           # Static assets (like indian-states.json, logo.png)
    ├── src/
    │   ├── api/            # Axios config & API service functions
    │   ├── assets/         # Project-specific assets (images, GeoJSON if not in public)
    │   ├── components/     # Reusable UI components (Navbar, ElectionCard, Map, Charts, Modals...)
    │   ├── contexts/       # React Context (AuthContext)
    │   ├── hooks/          # Custom React hooks (useWindowSize)
    │   ├── pages/          # Page-level components (Home, Login, Signup, Dashboard, Admin*, MapResults...)
    │   ├── routes/         # React Router setup (AppRoutes)
    │   ├── styles/         # Additional CSS/styling files (if any)
    │   ├── utils/          # Helper functions (auth, mapConfig, validation...)
    │   ├── App.css         # Main App component styles
    │   ├── App.jsx         # Main App layout component
    │   ├── index.css       # Global styles
    │   └── main.jsx        # React application entry point
    ├── .env              # Client-side environment variables
    ├── .gitignore        # Git ignore rules
    ├── eslint.config.js  # ESLint configuration
    ├── index.html        # HTML entry point for Vite
    ├── package-lock.json # (Omitted - Lockfile)
    ├── package.json      # Frontend dependencies and scripts
    ├── README.md         # (Omitted - Project README)
    └── vite.config.js    # Vite build configuration
```
---

## 🚀 Deployment

- **Frontend:** Deployed on [**Vercel**](https://vercel.com/) -> [https://votesafe.vercel.app](https://votesafe.vercel.app) 
- **Backend:** Deployed on [**Render**](https://render.com/) -> [https://vote-backend-ksfd.onrender.com](https://vote-backend-ksfd.onrender.com) 

*(Ensure environment variables are set correctly in both Vercel and Render)*

---

## 🔭 Future Scope

- Implement real-time updates using **WebSockets (Socket.IO)** instead of polling for live results.
- Add **server-side pagination** and search to all admin panel lists for better performance with large datasets.
- Integrate a dedicated validation library like **Joi** or **Zod** in the backend for more robust request validation.
- Implement **email verification** on signup.
- Add **unit and integration tests**.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Raghavverma109/voting_app/issues).

## 👨‍💻 Author

**Raghav Verma**

- GitHub: [@Raghavverma109](https://github.com/Raghavverma109)
- LinkedIn: [Raghav Verma](https://www.linkedin.com/in/raghav-verma-71870627a/)
- Email: [raghav.verma.3262@gmail.com](mailto:raghav.verma.3262@gmail.com)

---

<div align="center">

**⭐ Star this repository if you find it helpful! ⭐**

</div>
