# Deployment CORS & Cross-Site Cookie Session Fix

During the production deployment of **ByteBite**, when hosting the backend on Render (`onrender.com`) and the frontend on Vercel (`vercel.app`), users were unable to register or log in. The home page also failed to verify user sessions, resulting in console errors. 

This document details the problems, root causes, and technical solutions implemented.

---

## 1. Problem Description (Errors Encountered)

After deploying the project:
1. **Registration & Login Blocked:** Attempting to submit the register or login forms resulted in network failures.
2. **Session Verification Failed:** The home page console showed errors when hitting `/api/auth/check-auth`.
3. **Chrome Developer Console Errors:**
   - `Access to XMLHttpRequest at 'https://food-view-project.onrender.com/api/auth/user/register' from origin 'https://food-view-project.vercel.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'http://localhost:5173' that is not equal to the supplied origin.`
   - `Session verification failed: AxiosError: Network Error`

---

## 2. Root Cause Analysis

There were two distinct problems causing this behavior:

### A. Strict CORS Policy Block
* **Root Cause:** In the backend `src/app.js`, the Cross-Origin Resource Sharing (CORS) middleware origin was configured as:
  ```javascript
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
  ```
  Since `FRONTEND_URL` was not configured or updated on Render to point to the Vercel app, the backend fallback allowed only `http://localhost:5173`. When the Vercel domain (`https://food-view-project.vercel.app`) made request calls, the backend refused to attach the `Access-Control-Allow-Origin` header, causing the browser to block the preflight OPTIONS request.

### B. Cross-Site Cookie (SameSite) Policy Block
* **Root Cause:** The authentication system stores the session token in an HTTP-Only cookie. In `auth.controller.js`, the cookie was set with `sameSite: "lax"`.
* While `lax` works perfectly when the frontend and backend share the same domain (e.g. during local development on `localhost`), modern browsers (Chrome, Safari, Edge) block `lax` cookies on cross-site AJAX requests. 
* Because `vercel.app` (frontend) and `onrender.com` (backend) do not share the same registrable domain, they are treated as cross-site. The browser refused to store the `token` cookie when set by the backend, and refused to send it on subsequent `/check-auth` requests.

---

## 3. Technical Solutions Implemented

### A. Dynamic CORS Configuration (`backend/src/app.js`)
We updated the CORS configuration to dynamically authorize the origin. It now supports local development, the main deployed Vercel domain, and any Vercel preview/branch deployments (`*.vercel.app`) automatically:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://food-view-project.vercel.app"
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, postman, curl)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
```

### B. Production Cross-Site Cookies (`backend/src/controllers/auth.controller.js`)
We changed the SameSite attribute of the cookies to be dynamic. 
- In development, it uses `sameSite: "lax"`.
- In production, it uses `sameSite: "none"` and `secure: true`. This informs the browser that the cookie is intended for cross-domain usage and is safe because it is sent over HTTPS.

This was updated across all cookie setting and clearing logic (`registerUser`, `loginUser`, `logoutUser`, `registerFoodPartner`, `loginFoodPartner`, `logoutFoodPartner`, and `oauthSuccess`):

```javascript
// Setting the cookie:
res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Clearing the cookie:
res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
});
```

---

## 4. Key Takeaways (Interview / Reference Summary)

* **CORS is a browser-only security feature:** It does not block backend-to-backend requests, but strictly shields browser clients from unauthorized origins.
* **Cross-Site Cookie Security:** Cookies with `sameSite: "none"` require `secure: true` (HTTPS). Without HTTPS, modern browsers reject them completely.
* **HttpOnly is essential for XSS protection:** Even though we utilize cross-site cookies, keeping them `httpOnly` prevents malicious JavaScript scripts from stealing session tokens.

---

## 5. Incognito Mode & Third-Party Cookies (Behavioral Gotcha)

If testing the deployed application in **Incognito Mode** (or Private Browsing), you will observe the following behavior:
1. **Success Messages Appear:** Login will output `Login success: {success: true, ...}` in the console, and a success toast will show.
2. **Immediate Redirection:** The user will immediately be redirected back to the `/register` or `/login` page instead of accessing `/feed`.

### Why does this happen only in Incognito?
Modern browsers (like Google Chrome, Safari, and Edge) **block third-party cookies by default** in Incognito/Private mode.
- Because the frontend is on Vercel (`vercel.app`) and the backend is on Render (`onrender.com`), the browser treats the authentication cookie set by Render as a **third-party cookie**.
- The browser handles the login response JSON successfully (triggering the toast and log), but silently **discards/blocks the cookie** sent in the response headers.
- Immediately after login, the frontend calls the `/check-auth` endpoint. Since the cookie was discarded, the browser doesn't send the token, causing the session check to fail, which triggers a redirect back to `/register`.
- This can be confirmed by looking at the **crossed-out Eye icon** (or Cookie icon) in Chrome's URL bar next to the bookmark star.

### How to test:
- **Normal Browsing Mode:** Normal browser windows allow these cookies by default. The login and session verification will work seamlessly.
- **Enabling Cookies in Incognito:** Click on the crossed-out Eye icon in the address bar and select **"Allow third-party cookies"** to test session persistence in Incognito.
- **Production Solution:** Once a custom domain is mapped (e.g. `bytebite.com` for frontend and `api.bytebite.com` for backend), the browser treats the cookie as a **First-Party Cookie**, and it will work in Incognito out of the box without changing any browser settings.
