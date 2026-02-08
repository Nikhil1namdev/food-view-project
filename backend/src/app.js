// create server
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

// Conditionally parse JSON - skip for multipart/form-data to avoid corrupting file uploads
app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("multipart/form-data")) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

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
