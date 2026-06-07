// create server
const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("./services/passport");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const cors = require("cors");

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
      // allow requests with no origin (like mobile apps, postman, curl)
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
app.use(cookieParser());
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});
//application me autheticaon realated api server ko bataya  ,/api/auth is prefix hai jo ki auth ki api ko access karna ho to lagana padega
app.use("/api/auth", authRoutes);
//application me food realated api server ko bataya
app.use("/api/food", foodRoutes);
//application me food partner realated api server ko bataya
app.use("/api/food-partner", foodPartnerRoutes);

module.exports = app;

// Router path	Final API URL
// /register	/api/auth/register
// /login	/api/auth/login
// app.use('/api/auth', authRoutes) ka matlab hai: authRoutes ke saare routes /api/auth se start honge.
// /api/auth ek base URL (prefix) set kar diya
// 👉 authRoutes ke saare routes iske andar aa gaye
