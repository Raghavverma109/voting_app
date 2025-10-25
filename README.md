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

*(Remember to add actual screenshots to a `./screenshots` folder and update paths)*

| Feature         | Screenshot                               | Description                                      |
| --------------- | ---------------------------------------- | ------------------------------------------------ |
| **Home Page** | `![Home](./screenshots/home.png)`        | Landing page with application overview.          |
| **Signup** | `![Signup](./screenshots/signup.png)`      | User registration with detailed fields & photo.  |
| **Login** | `![Login](./screenshots/login.png)`       | Secure login using Aadhaar number & password.    |
| **Dashboard** | `![Dashboard](./screenshots/dashboard.png)` | User dashboard listing elections.                |
| **Voting Panel**| `![Voting](./screenshots/voting.png)`      | Interface for casting a vote in a live election. |
| **Live Results**| `![Live Results](./screenshots/live_results.png)` | Real-time charts showing current vote counts.    |
| **Map Results** | `![Map Results](./screenshots/map_results.png)` | Geographical visualization of results by state.  |
| **Admin Panel** | `![Admin Home](./screenshots/admin_home.png)` | Admin navigation hub.                          |
| **Manage Parties**| `![Manage Parties](./screenshots/admin_parties.png)` | Admin interface for managing candidates/parties. |
| **Manage Elections**|`![Manage Elections](./screenshots/admin_elections.png)`| Admin interface for managing elections.        |
| **Audit History**| `![Audit History](./screenshots/admin_history.png)`| List of past elections for auditing.           |
| **Audit Detail**| `![Audit Detail](./screenshots/admin_audit_detail.png)`| Detailed view of voter participation list.   |
| **Profile Page**| `![Profile](./screenshots/profile.png)`    | User's profile view and password change.       |

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

## 📁 Project Structure (Simplified)

```
voting_app/
├── backend/
│   ├── models/           # Mongoose schemas (User, Election, Candidate)
│   ├── routes/           # API route handlers (userRoutes, electionRoutes, candidateRoutes)
│   ├── middleware/       # JWT auth (jwtAuthMiddleware, adminCheck)
│   ├── .env              # Server environment variables
│   ├── server.js         # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── public/           # Static assets (like indian-states.json)
│   ├── src/
│   │   ├── api/            # Axios config & API service functions
│   │   ├── assets/         # Images, GeoJSON (if not in public)
│   │   ├── components/     # Reusable UI components (Navbar, ElectionCard, Map, Charts, Modals...)
│   │   ├── contexts/       # React Context (AuthContext)
│   │   ├── hooks/          # Custom React hooks (useWindowSize)
│   │   ├── pages/          # Page-level components (Home, Login, Signup, Dashboard, Admin*, MapResults...)
│   │   ├── routes/         # React Router setup (AppRoutes)
│   │   ├── utils/          # Helper functions (auth, mapConfig, validation...)
│   │   ├── App.jsx         # Main App layout
│   │   └── main.jsx        # React entry point
│   ├── .env              # Client-side environment variables
│   ├── vite.config.js    # Vite build configuration
│   └── package.json
│
└── screenshots/          # Application screenshots (.png files)
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

---

## 👨‍💻 Author

**Raghav Verma**

- GitHub: [@Raghavverma109](https://github.com/Raghavverma109)
- LinkedIn: [linkedin.com/in/raghav-verma-71870627a](https://www.linkedin.com/in/raghav-verma-71870627a/)
- Email: raghav.verma.3262@gmail.com

---

<div align="center">

**⭐ Star this repository if you find it helpful! ⭐**

</div>