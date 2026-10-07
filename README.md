# 🛍️ Dealwaale.in

Dealwaale.in is a full-stack, real-time B2B/B2C marketplace platform built with the MERN stack. It connects buyers and sellers, allowing them to create requests, browse deals, negotiate via real-time chat, and leverage an AI assistant for smart insights.

## ✨ Features

* **Multi-Role Authentication**: Dedicated dashboards for **Buyers** and **Sellers** with JWT-based secure authentication.
* **Smart Dashboards**: Detailed financial overviews, analytics, and metrics using Recharts.
* **Ticketing System**: 
  * Buyers can create requests for what they need.
  * Sellers can list quick buys and bulk tickets.
* **Real-time Chat**: Connect and negotiate instantly using WebSockets (`Socket.io`).
* **AI Assistant**: Integrated Google Gemini AI to assist users with smart recommendations and chat support.
* **Image Management**: Seamless image uploads and management powered by Cloudinary.

## 🛠️ Technology Stack

* **Frontend**: React 19 (Vite), Tailwind CSS v4, React Router v7, Recharts, Socket.io-client.
* **Backend**: Node.js, Express.js, Socket.io (Real-time).
* **Database**: MongoDB (Mongoose).
* **AI & Media**: `@google/genai` (Gemini), Cloudinary, Multer.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
* [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/PratapShaurya90/Dealwaale.in.git
cd Dealwaale.in
```

### 2. Install Dependencies

You will need to install the dependencies for both the `client` and the `server`.

**For the Backend (Server):**
```bash
cd server
npm install
```

**For the Frontend (Client):**
```bash
cd ../client
npm install
```

### 3. Setup Environment Variables (.env)

Create a `.env` file in the **`server`** directory and add the following keys. Make sure to replace the placeholder values with your actual credentials:

```env
# Server Port
PORT=5000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dealwaale?retryWrites=true&w=majority

# Authentication Secret
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary (For Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI Integration
GEMINI_API_KEY=your_google_gemini_api_key
```

*(Optional)* If you have environment variables for the frontend, create a `.env` file in the **`client`** directory:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Seed the Database (Optional but Recommended)

To populate the database with dummy buyers, sellers, tickets, and deals to test the application, run the seeder script:

```bash
cd server
node seedUsers.js
```

### 5. Run the Application Locally

You will need two separate terminal windows/tabs to run the client and server concurrently.

**Start the Server (Backend):**
```bash
cd server
npm run dev 
# or node server.js
```

**Start the Client (Frontend):**
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.

---

## 📂 Project Structure

```text
Dealwaale.in/
├── client/                 # Frontend React Application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts (Sidebar, Nav, Razorpay)
│   │   ├── pages/          # Main route pages (Buyer, Seller, Auth)
│   │   └── sections/       # Feature-specific components (Analytics, Tickets)
│   └── package.json
└── server/                 # Backend Node.js/Express Application
    ├── controllers/        # Route logic and AI handlers
    ├── middlewares/        # JWT Authentication and protection
    ├── model/              # Mongoose Schemas (User, Deal, Ticket)
    ├── routes/             # Express API routing
    ├── services/           # Socket.io, LLM Prompts, and external services
    ├── seedUsers.js        # Script to inject dummy test data
    └── package.json
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/PratapShaurya90/Dealwaale.in/issues).

## 📝 License

This project is licensed under the ISC License.
