# ByteBite Interview Prep & Technical Highlights

This document translates **ByteBite's** technical features into high-impact, resume-ready bullet points, and provides robust talking points for technical interviews.

---

## 📝 Resume Bullet Points (MERN Stack Highlights)

* **Robust Auth**: "Engineered role-based authentication using **JSON Web Tokens (JWT)** set via secure **HttpOnly Cookies**, eliminating Cross-Site Scripting (XSS) access to credentials and securing different authorization flows for Consumers and Merchants."
* **Advanced Media Pipeline**: "Designed a serverless video streaming pipeline leveraging **Multer** and **ImageKit API**, enabling direct buffer streaming of short videos to a globally distributed CDN with auto-compression formats (MP4/WebM), bypassing local server disk limitations."
* **Optimized Infinite Scroll**: "Developed a high-performance TikTok-style vertical feed using React, utilizing optimized rendering to handle continuous video playback with seamless state synchronization for likes, saves, and comments."
* **Reliable Persistence Layer**: "Architected a normalized MongoDB schema using Mongoose, creating optimized lookup indexes for cross-referenced documents (Users, Partners, Reels, Likes, Saves) ensuring sub-100ms API response rates."

---

## 💬 Tough Interview Questions & Answers

### Q1: "How did you handle the security of JWT in your application?"
> **Answer**: "I avoided storing JWTs in `localStorage` or `sessionStorage` because they are vulnerable to Cross-Site Scripting (XSS) scripts. Instead, I set JWTs in the Express backend using **HttpOnly cookies** with the **SameSite=Lax** policy. This restricts JavaScript in the client-side from reading the token while protecting the API against Cross-Site Request Forgery (CSRF) for normal navigation. Additionally, I implemented separate authorization middlewares (`authUserMiddleware` and `authFoodPartnerMiddleware`) to check token ownership and prevent cross-role privilege escalation."

### Q2: "Video uploads can block the Node.js event loop due to high processing loads. How did you optimize your upload pipeline?"
> **Answer**: "To prevent server disk space pollution and disk I/O blocking, I configured **Multer** to use memory storage buffers. When a Food Partner uploads a reel, the video buffer is instantly piped over HTTPS to **ImageKit CDN**. ImageKit does the heavy lifting: compression, generating responsive formats, and distributing it globally. The node server only writes the secure CDN URL back to the MongoDB document. This keeps our microservice event loop extremely light and scalable."

### Q3: "What were some performance optimization strategies used in the video feed?"
> **Answer**: "Continuous video scrolling is prone to memory leaks and lagging frame rates. To mitigate this, I built the feed mobile-first, ensuring lightweight styles. In the React architecture, we offload individual video playback controls directly to the video component using standard HTML5 attributes (`loop`, `playsInline`, `muted`). We also synchronize global actions like 'Like' or 'Save' using an optimistic state pattern: the UI updates instantly while the Axios API request happens asynchronously in the background. If the request fails, the UI rolls back cleanly."

### Q4: "Why did you build custom reusable form and auth layouts instead of writing them directly in page components?"
> **Answer**: "In standard SaaS apps, authentication pages often share 90% of styling tokens (glassmorphism overlays, error alert patterns, submit loaders) but separate forms introduce heavy duplication. I decoupled these into five stateless wrappers: `AuthLayout` (for neon layouts & GSAP entrance curves), `AuthCard` (glass bounds), `AuthInput` (focus transitions and dynamic Lucide icons), `AuthButton` (dynamic loading tracking), and `AuthOptionCard` (role selection). This design ensures that adding new onboarding steps—like email verification or OTP logins—only requires swapping simple schema parameters rather than rebuilding full form DOM structures."

