# 📑 DealWalale API Documentation

This file maps out the exact Request Payloads (sent to the backend database) and the Response Payloads (returned to the client).

---

## 🔐 Auth Endpoints (`/api/auth`)

### 1. Register User
* **Method:** `POST`
* **Route:** `/api/auth/register`
* **Request Payload (Sent):**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "9876543210",
  "city": "Mumbai",
  "profession": "Retailer",
  "role": "seller" 
}
```
* **Success Response (Received):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJI...",
  "user": {
    "id": "64ef245...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "seller"
  }
}
```

### 2. Login User
* **Method:** `POST`
* **Route:** `/api/auth/login`
* **Request Payload (Sent):**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```
* **Success Response (Received):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJI...",
  "user": {
    "id": "64ef245...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "seller"
  }
}
```

### 3. Refresh Access Token
* **Method:** `POST`
* **Route:** `/api/auth/refresh`
* **Prerequisites:** Requires the `Jwt_token` cookie.
* **Request Payload (Sent):** None (Uses Cookies).
* **Success Response (Received):**
```json
{
  "token": "eyJhbGciOiJI...",
  "user": {
    "id": "64ef24...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "seller"
  }
}
```

### 4. Fetch / Update Profile
* **Method:** `GET` / `PUT`
* **Route:** `/api/auth/profile`
* **PUT Payload (Sent):**
```json
{
  "username": "johndoe",
  "city": "Delhi",
  "profession": "Wholesaler"
}
```
* **GET/PUT Response (Received):**
```json
{
  "success": true,
  "user": {
    "_id": "64ef24...",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "9876543210",
    "city": "Delhi",
    "profession": "Wholesaler",
    "role": "seller",
    "subscriptionType": "basic"
  },
  "connectedCount": 3
}
```

---

## 💼 Seller Endpoints (`/api/seller`)

### 1. Browse Dealer / Quick Deals
* **Method:** `GET`
* **Routes:** `/api/seller/browsedealer` or `/api/seller/quickbuys`
* **Query Params:** `?page=1&limit=5`
* **Success Response (Received):**
```json
{
  "ticket": [
    {
      "_id": "65ef12...",
      "username": "dealer1",
      "email": "dealer@example.com",
      "profession": "Wholesaler",
      "city": "Pune"
    }
  ],
  "totalPages": 3,
  "total": 15
}
```

---

## 🛒 Buyer Endpoints (`/api/buyer`)

### 1. Create Ticket / Buy Request
* **Method:** `POST`
* **Route:** `/api/buyer/tickets`
* **Request Payload (Sent):**
```json
{
  "title": "Need 50 Laptops",
  "description": "Required bulk i5 laptops for office deployment",
  "category": "Electronics"
}
```
* **Success Response (Received):**
```json
{
  "success": true,
  "data": {
    "_id": "65ab34...",
    "title": "Need 50 Laptops",
    "description": "Required bulk i5 laptops for office deployment",
    "category": "Electronics",
    "buyerId": "64ef24..."
  }
}
```

### 2. Browse Sellers
* **Method:** `GET`
* **Route:** `/api/buyer/browsesellers`
* **Success Response (Received):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64ff34...",
      "username": "gadgets_seller",
      "city": "Chennai",
      "profession": "Supplier"
    }
  ]
}
```

---

## 💬 Chat Endpoints (`/api/chat`)

### 1. Recent Chats
* **Method:** `GET`
* **Route:** `/api/chat/recent`
* **Success Response (Received):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "654cde...",
      "senderId": "64ef24...",
      "receiverId": "64ff34...",
      "message": "Hey, I saw your post!",
      "timestamp": "2026-04-29T04:00:00Z"
    }
  ]
}
```
