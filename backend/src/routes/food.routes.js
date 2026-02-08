const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

/* POST /api/food/ [protected]*/
//ye api food item add krne ke liye hai db me
router.post(
  "/",
  (req, res, next) => {
    console.log("=== DEBUG INFO ===");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("All Headers:", req.headers);
    next();
  },
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood,
);

/* GET /api/food/ [protected] */
//ye normal user ke liye hai food partner ke liye nhi
router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);

router.post(
  "/like",
  express.json(),
  authMiddleware.authUserMiddleware,
  foodController.likeFood,
);

router.post(
  "/save",
  express.json(),
  authMiddleware.authUserMiddleware,
  foodController.saveFood,
);

router.get(
  "/save",
  authMiddleware.authUserMiddleware,
  foodController.getSaveFood,
);

module.exports = router;
