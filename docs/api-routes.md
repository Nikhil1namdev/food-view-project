# ByteBite API Routes Blueprint

This document houses the complete REST API mapping for the **ByteBite** vertical-video food commerce platform. It outlines the base URLs, authentication barriers, payload parameters, and response standards.

---

## 🚦 Base URL
* Local Backend API Server: `http://localhost:3000/api`
* Credentials Transfer: Requires `withCredentials: true` on Axios clients for HttpOnly cookie validation.

---

## 🔒 Authentication API (`/api/auth`)

### 1. **Consumer (User) Portal Endpoints**
* **`POST /api/auth/user/register`**
  * **Role Restriction**: None
  * **Headers**: `Content-Type: application/json`
  * **Payload**:
    ```json
    {
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "password": "securepassword123"
    }
    ```
  * **Response (201 Created)**: Returns the user profile details and injects a signed JWT `token` in response cookies as `HttpOnly`.

* **`POST /api/auth/user/login`**
  * **Payload**:
    ```json
    {
      "email": "jane@example.com",
      "password": "securepassword123"
    }
    ```
  * **Response (200 OK)**: Returns the active session profile and inserts the `token` cookie.

* **`GET /api/auth/user/logout`**
  * **Response (200 OK)**: Dynamically clears the JWT cookies on the client browser.

---

### 2. **Merchant (Food Partner) Portal Endpoints**
* **`POST /api/auth/food-partner/register`**
  * **Payload**:
    ```json
    {
      "name": "Tasty Street Bites",
      "contactName": "John Doe",
      "phone": "+91 90000 00000",
      "email": "merchant@example.com",
      "password": "securepassword123",
      "address": "123 Market Street, Block B"
    }
    ```
  * **Response (201 Created)**: Onboards the merchant profile and attaches a signed merchant JWT `token` in `HttpOnly` cookies.

* **`POST /api/auth/food-partner/login`**
  * **Payload**:
    ```json
    {
      "email": "merchant@example.com",
      "password": "securepassword123"
    }
    ```
  * **Response (200 OK)**: Authenticates the merchant profile and returns the JWT cookie.

* **`GET /api/auth/food-partner/logout`**
  * **Response (200 OK)**: Clears the merchant JWT cookie.

---

### 3. **Global Session Verification**
* **`GET /api/auth/check-auth`**
  * **Role Restriction**: None (Checks JWT tokens)
  * **Response (200 OK)**:
    ```json
    {
      "isAuthenticated": true,
      "role": "partner",
      "user": {
        "_id": "6a0965efa5...",
        "name": "Tasty Street Bites",
        "email": "merchant@example.com"
      }
    }
    ```
  * **Use Case**: Fired globally in React `AuthContext` mount sequences to check token existence and restore active profiles without layout flashes.

---

## 🍔 Food Reels & Commerce API (`/api/food`)

### 1. **Add Food Reel**
* **`POST /api/food`**
  * **Role Restriction**: `Food Partner` only (Checked by `authFoodPartnerMiddleware`)
  * **Headers**: `Content-Type: multipart/form-data`
  * **Payload (form-data)**:
    * `name`: Spicy Paneer Wrap (String)
    * `description`: Farm fresh ingredients (String)
    * `video`: `file.mp4` (Binary file buffer parsed by Multer)
  * **Response (201 Created)**: Pipes the video to ImageKit, generates globally cached streaming links, and writes the Mongoose document.

### 2. **Fetch Active Feed**
* **`GET /api/food`**
  * **Role Restriction**: None (Consumers swipe reels)
  * **Response (200 OK)**: Returns the array list of active food videos with associated likes and bookmark metrics.

### 3. **Like Reel Toggle**
* **`POST /api/food/like`**
  * **Role Restriction**: `Consumer` only (Checked by `authUserMiddleware`)
  * **Payload**:
    ```json
    {
      "foodId": "6a0966025c7..."
    }
    ```
  * **Response (200 OK)**:
    ```json
    {
      "like": true,
      "message": "Liked successfully"
    }
    ```

### 3. **Bookmark Reel Toggle**
* **`POST /api/food/save`**
  * **Payload**: `{"foodId": "6a0966025c7..."}`
  * **Response (200 OK)**: `{"save": true, "message": "Saved successfully"}`

### 4. **Fetch Bookmarked Collection**
* **`GET /api/food/save`**
  * **Role Restriction**: `Consumer` only (Checked by `authUserMiddleware`)
  * **Response (200 OK)**: Returns a populated array list of saved food reels associated with the user profile.
