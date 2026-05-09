# 🗺️ DealWalale.in - Technical Data Map

This document tracks how data flows between the Frontend and Backend for your Seller Dashboard features.

---

## 🏗️ 1. Database Structure (User Model)
**Source**: `server/model/user.js`

| Field | Type | Description |
| :--- | :--- | :--- |
| `username` | String | Display name of the user. |
| `email` | String | Unique identifier for login. |
| `password` | String | Hashed using bcrypt (never visible to frontend). |
| `phone` | String | Contact number. |
| `city` | String | Location for filtering. |
| `profession`| String | Category/Genre (e.g., Electronics, Fashion). |
| `role` | String | Either `"seller"` or `"buyer"`. |

---

## 🛣️ 2. API Routes & Data Flow

### A. Authentication: Register
*   **Method**: `POST`
*   **Route**: `/api/auth/register`
*   **Flow**: Frontend [Register.jsx] ➡️ Backend [authee.js] ➡️ MongoDB
*   **Request Data (Frontend sends)**: `username, email, password, phone, city, profession, role`
*   **Response Data (Backend sends)**: `message, token, user { id, username, email, role }`

### B. Authentication: Login
*   **Method**: `POST`
*   **Route**: `/api/auth/login`
*   **Flow**: Frontend [Login.jsx] ➡️ Backend [authee.js] ➡️ Verification ➡️ Response
*   **Request Data**: `email, password`
*   **Response Data**: `message, token, user { id, username, email, role }`
*   **Storage**: Token is saved in `localStorage` as `"Token"`.

### C. Browse Dealers (Seller Dashboard)
*   **Method**: `GET`
*   **Route**: `/api/v1/seller/browsedealer`
*   **Security**: Uses `protect.js` middleware (requires Bearer Token).
*   **Flow**: BrowseDealer.jsx (useEffect) ➡️ Middleware ➡️ browseDealer.js Controller ➡️ MongoDB
*   **Request Headers**: `Authorization: Bearer <Token>`
*   **Response Data**:
    ```json
    {
      "message": "Dealers Found Successfully",
      "dealers": [
          { "_id": "...", "username": "...", "city": "...", "profession": "..." }
      ]
    }
    ```

---

## 🔄 3. Frontend logic
**File**: `client/src/sections/seller/BrowseDealer.jsx`

1.  **State Management**: `const [dealers, setDealers] = useState([])`
2.  **The Fetch**:
    - Calls `http://localhost:5000/api/v1/seller/browsedealer`.
    - Pulls data using `response.data.dealers`.
3.  **The Display**:
    - Loops through `dealers` using `.map()`.
    - Displays `{dealer.username}` inside the dynamic grid.

---

## 🛠️ Key Mappings Summary
*   **Frontend Key**: `localStorage.getItem("Token")`
*   **Backend Key**: `decoded.userId` (Extracted from JWT)
*   **API Port**: `5000`
*   **Filter Used**: `User.find({ role: "buyer" })`
