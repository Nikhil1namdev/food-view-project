# ByteBite Architecture & Technology Decisions

Welcome to the architectural blueprint of **ByteBite**—a next-generation, high-performance food discovery and vertical-video commerce platform. This document explains the core technical underpinnings and why specific technologies were chosen over alternatives.

---

## 🏗️ Core Architecture Overview

ByteBite follows a clean, decoupled **MERN (MongoDB, Express, React, Node)** stack with a clear **Separation of Concerns (SoC)**:

```
+----------------------------------------+
|           Frontend (React SPA)          |
|  - UI (GSAP / Vanilla CSS)             |
|  - Global State (Context API)          |
|  - Router (React Router v7)            |
+-------------------+--------------------+
                    | (Axios Requests)
                    v
+-------------------+--------------------+
|          Backend (Express v5 Engine)   |
|  - Middlewares (Auth, Multer)          |
|  - Controllers (Business logic)        |
|  - Services (ImageKit CDN Pipeline)    |
+-------------------+--------------------+
                    | (Mongoose ODM)
                    v
+-------------------+--------------------+
|               MongoDB Cloud            |
|  - Persistent storage (Collections)    |
+----------------------------------------+
```

---

## 🛠️ Technology Choices & Justification

### 1. **React.js (Vite) instead of Next.js (for the MVP)**
* **Vite Engine**: Provides sub-second HMR (Hot Module Replacement) and optimized production builds.
* **SPA Lifecycle Control**: Since ByteBite relies heavily on continuous media playback (vertical infinite-scroll video reels), keeping it as a Single Page Application (SPA) allows us to prevent page-reload visual stutter and keep the audio/video context unified easily via local React state and standard HTML5 media APIs.

### 2. **Context API instead of Redux Toolkit (RTK)**
* **Trade-off Analysis**: Redux introduces substantial boilerplate code. For ByteBite, global state is primarily required for **User Authentication session persistence**, **Reel Feed local video lists**, and **Global Cart states**. Context API coupled with Custom Hooks (`useAuth`, `useCart`) provides a highly performant, lightweight solution without overhead.
* **Future-proofing**: If the application grows to include complex peer-to-peer real-time delivery tracking, we can scale selectively to Zustand or RTK.

### 3. **Multer & ImageKit Pipeline (Instead of local server storage or AWS S3)**
* **Why ImageKit?**: Videos must load fast for vertical feeds. S3 stores files, but doesn't optimize. ImageKit acts as both **Cloud Storage** and an **Image/Video CDN**. It automatically optimizes file delivery formats (e.g., serving WebM/MP4 compressed on the fly) and provides built-in real-time resizing.
* **Why Multer Memory Storage?**: Multer parses `multipart/form-data` and processes the file in memory buffer instead of writing to disk. We pipe this buffer directly to the ImageKit API. This avoids polluting server disk space, improves performance, and enables serverless scalability.

### 4. **Express.js v5 instead of v4**
* **Native Promise Handling**: Express v5 natively catches rejected promises in controllers and routes, routing them automatically to the global error middleware without requiring a wrapper function (`express-async-errors`). This keeps our controllers clean of repetitive `try-catch` blocks and prevents unhandled rejections.

---

## 🔑 Authentication Architecture

ByteBite implements secure, production-ready cookie-based **JWT Authentication**:

1. **HttpOnly Cookies**: JWT tokens are signed using a server-side `JWT_SECRET` and injected into the response headers as `HttpOnly` and `SameSite=Lax` cookies.
   * **Security Impact**: Prevents Cross-Site Scripting (XSS) attacks because JavaScript cannot access `document.cookie` to read the token.
2. **Cross-Role Authorization**: The backend exposes two main roles using specialized middlewares:
   * **`authUserMiddleware`**: Decodes JWT and validates against `userModel` (MongoDB `users`).
   * **`authFoodPartnerMiddleware`**: Decodes JWT and validates against `foodPartnerModel` (MongoDB `foodpartners`).
   * **Why Separate?**: Prevents authorization bypass vulnerabilities. A food partner cannot perform administrative actions meant for normal consumers and vice versa.

---

## 🎬 Immersive Home Feed Architecture

The feed is built using a mobile-first philosophy that guarantees high performance even on lower-tier mobile hardware. It utilizes standard browser native protocols combined with efficient React rendering pipelines.

### 1. **Scroll Snapping Mechanism**
To replicate the smooth vertical snapping of TikTok and Instagram Reels without importing bulky JavaScript scroll plugins, we utilized native CSS Scroll Snapping:
* **Container Styling:** 
  ```css
  .reel-container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
  }
  ```
* **Card Element Styling:**
  ```css
  .reel-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  ```
* **Advantage:** Native browser scroll snapping runs on the compositor thread, ensuring 60fps scrolling and avoiding the "jank" associated with custom JS scroll position listeners.

### 2. **Autoplay and Pause Logic (Intersection Observer API)**
Continuously tracking the window scroll position to determine which video is active is highly resource-intensive and leads to frames dropping during scrolling.
* **Our Solution:** The `Intersection Observer API` is used to watch each video card inside `ReelFeed.jsx`.
* **Behavior:** 
  * We watch for an intersection ratio threshold of at least `0.6` (60% visible inside the viewport bounds).
  * When a video crosses this threshold, we immediately trigger `.play()`, unmute/mute it matching the user's unified sound pref, and set it as the active card.
  * When it scrolls out of this threshold, we call `.pause()` to free up GPU and decoding resources.
* **Advantage:** Unlike continuous scroll listeners, Intersection Observer operates asynchronously, leaving the main thread unblocked and preventing battery drain on mobile viewports.

### 3. **Unified Mute/Unmute State (Sound Binds)**
Standard modern web browsers (Chrome, Safari, iOS WebKit) strictly prohibit autoplaying videos with sound enabled unless there has been a prior direct user interaction (such as a tap).
* **ByteBite Solution:** 
  * Videos default to `muted={true}` on initial mounting to bypass browser autoplay blocks.
  * A unified `isMuted` context state is maintained in `ReelFeed`. When the user clicks the floating Sound button (or taps anywhere on a reel), we toggle the state of all videos in the loop to sync instantly.
  * This guarantees compliance with browser audio protocols while offering a single-tap unmute experience.

### 4. **GSAP Micro-Interactions Decisions**
Animations should always supplement usability, never distract from it.
* **Controlled Reveals:** When a video card becomes active (detected via Intersection Observer), we use GSAP `animateFadeUp` on the details container and `animateStagger` on the sidebar action icons.
* **Spring Dynamics:** Sidebar actions (Like/Save buttons) trigger subtle spring scaling (`scale: 1.3`, `duration: 0.15`, `yoyo: true`) using an elastic easing to give physical, tactile satisfaction to user inputs.
* **Advantage:** Over-animating ruins utility. By restricting GSAP to mounting/focus transitions and action triggers, we keep the UI responsive and production-grade.
