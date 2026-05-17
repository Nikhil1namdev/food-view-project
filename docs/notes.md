# ByteBite Technical Notes & Workspace Reference

This document serves as a live developer ledger for **ByteBite**. It stores workspace paths, setup configurations, API endpoints, and critical implementation details for quick recall.

---

## 📂 Active Workspace Folder Structure

```
/ (Root)
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers (auth, food, foodpartner)
│   │   ├── db/               # MongoDB configuration (db.js)
│   │   ├── middlewares/      # authUser, authFoodPartner middlewares
│   │   ├── models/           # Mongoose schemas (user, foodpartner, food, likes, save)
│   │   ├── routes/           # Express router files
│   │   ├── services/         # ImageKit storage integrations
│   │   └── app.js            # App configuration (CORS, body parser, cookies)
│   ├── server.js             # Main server execution point
│   ├── package.json
│   └── .env                  # Environment configurations
├── frontend/
│   ├── src/
│   │   ├── assets/           # Static media assets
│   │   ├── components/       # Reusable components
│   │   │   ├── auth/         # Specialized onboarding elements (AuthLayout, AuthCard)
│   │   │   ├── home/         # High-fidelity feed controllers
│   │   │   │   ├── Navbar.jsx       # Floating sticky header portal
│   │   │   │   ├── HeroSection.jsx  # Landing promotion highlights
│   │   │   │   ├── ReelFeed.jsx     # Vertical snapping scroller
│   │   │   │   ├── VideoCard.jsx    # Card previews (saved/grids)
│   │   │   │   ├── EmptyFeed.jsx    # Cinema discovery empty states
│   │   │   │   ├── BottomNav.jsx    # Floating mobile navigation
│   │   │   │   ├── FeedOverlay.jsx  # Absolute descriptions and partner tags
│   │   │   │   └── FeedActions.jsx  # Sticky sidebar buttons (Likes, saves)
│   │   ├── pages/            # View pages (auth/, food-partner/, general/)
│   │   ├── routes/           # Routing configuration (AppRoutes.jsx)
│   │   ├── styles/           # CSS design tokens & sheets
│   │   ├── App.jsx           # Root UI component
│   │   └── main.jsx          # React SPA bootstrap mount
│   ├── package.json
│   └── notes.txt             # Original draft notes
└── docs/                     # Technical documentation ledger
```

---

## 🔌 API Route Map

### 🔒 Authentication Routes (`/api/auth`)
* `POST /api/auth/user/register` - Registers consumer
* `POST /api/auth/user/login` - Authenticates consumer & sets JWT cookie
* `GET /api/auth/user/logout` - Clears cookie & logs out consumer
* `POST /api/auth/food-partner/register` - Registers food merchant
* `POST /api/auth/food-partner/login` - Authenticates merchant & sets JWT cookie
* `GET /api/auth/food-partner/logout` - Clears cookie & logs out merchant

### 🍔 Food Operations Routes (`/api/food`)
* `POST /api/food/` - Uploads food item (Requires Food Partner auth, parses `multipart/form-data`)
* `GET /api/food/` - Gets infinite scroll feeds (Requires Normal User auth)
* `POST /api/food/like` - Toggles like on a food reel (Requires User auth)
* `POST /api/food/save` - Toggles bookmark on a food reel (Requires User auth)
* `GET /api/food/save` - Fetches all saved items for the active user

---

## 🛠️ Local Environment Checklist

### Backend `.env` Schema:
```env
JWT_SECRET=your_32_character_hex_secret
MONGODB_URI=mongodb://localhost:27017/food-view-project
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
```

### CORS Policies:
* Frontend runs on `http://localhost:5173` (or `http://localhost:5174` depending on active local ports)
* Backend runs on `http://localhost:3000`
* `credentials: true` must be specified on BOTH frontend Axios defaults (or config object) and backend CORS settings for JWT cookies to be parsed successfully.
