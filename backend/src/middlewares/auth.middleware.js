const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {
  console.log("=== AUTH FOOD PARTNER MIDDLEWARE ===");
  console.log("Cookies received:", req.cookies);
  const token = req.cookies.token;

  //check karo token hai ya nhi
  if (!token) {
    console.log("❌ No token found in cookies");
    return res.status(401).json({
      message: "Please login first",
    });
  }
  console.log("✅ Token found:", token.substring(0, 20) + "...");
  //agar token hai to verify karo token ko
  try {
    //iss decoded ke ander data aayega agar token sahi hoga to or token ke ander humne foodparten ki id rakhi thi
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodPartner = await foodPartnerModel.findById(decoded.id);

    req.foodPartner = foodPartner;
    //next() function ke through middleware ke bad ke function ko call krte hai
    next();
  } catch (err) {
    //agar token invalid hai to

    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

//
async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await userModel.findById(decoded.id);
    console.log("decoded token:", decoded);
console.log("user from DB:", user);


     if (!user) {
  return res.status(401).json({
    message: "User not registered",
  });
}
 
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware,
};
