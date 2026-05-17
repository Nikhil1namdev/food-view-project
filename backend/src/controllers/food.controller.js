const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");


// =========================================================================
// CREATE NEW FOOD REEL (POST /api/food/)
// =========================================================================
// Handles multipart form upload from the merchant's Creator Studio.
// Pipeline: Multer buffer → ImageKit CDN → MongoDB document creation.
// Protected by authFoodPartnerMiddleware (only merchants can upload).
async function createFood(req, res) {   
  try {
    console.log(req.foodPartner);
    console.log("Body received:", req.body);
    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "Video file is required",
      });
    }

    if (!req.body.name || !req.body.description) {
      return res.status(400).json({
        message: "Name and description are required",
      });
    }

    const fileUploadResult = await storageService.uploadFile(
      req.file.buffer,
      uuid(),
    );
    console.log("Upload result:", fileUploadResult);

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    //201 isliye jab koi naya resource create hota hai to 201 status code dete hai
    res.status(201).json({
      message: "food created successfully",
      food: foodItem,
    });
  } catch (error) {
    console.error("Error in createFood:", error);
    res.status(500).json({
      message: "Failed to create food item",
      error: error.message,
    });
  }
}


// =========================================================================
// GET ALL FOOD REELS FOR HOME FEED (GET /api/food/)
// =========================================================================
// Returns all food items WITH the current user's like/save status.
// This allows the frontend to show filled hearts/bookmarks for items
// the user has already interacted with (prevents double-liking).
//
// How it works:
// 1. Fetch all food items from DB
// 2. Fetch all likes & saves by the current user (batch query, not per-item)
// 3. Create Sets for O(1) lookup performance
// 4. Merge `isLiked` and `isSaved` boolean flags into each food item
async function getFoodItems(req, res) {
  try {
    const userId = req.user._id;
    
    // Parallel queries for maximum performance (Promise.all)
    const [foodItems, userLikes, userSaves] = await Promise.all([
      foodModel.find({}).populate("foodPartner", "name"),
      likeModel.find({ user: userId }).select("food"),
      saveModel.find({ user: userId }).select("food"),
    ]);

    // Create Sets for O(1) lookup instead of O(n) array.includes()
    const likedFoodIds = new Set(userLikes.map(l => l.food.toString()));
    const savedFoodIds = new Set(userSaves.map(s => s.food.toString()));

    // Merge interaction status into each food item
    const enrichedItems = foodItems.map(item => {
      const obj = item.toObject();
      return {
        ...obj,
        isLiked: likedFoodIds.has(obj._id.toString()),
        isSaved: savedFoodIds.has(obj._id.toString()),
      };
    });

    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems: enrichedItems,
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Failed to fetch food items" });
  }
}


// =========================================================================
// TOGGLE LIKE ON FOOD REEL (POST /api/food/like)
// =========================================================================
// Implements a toggle pattern (idempotent):
// - If user hasn't liked → create like document + increment counter
// - If user already liked → delete like document + decrement counter
//
// Why a separate 'likes' collection instead of an array in food document?
// → Arrays in MongoDB have a 16MB document limit. If a reel goes viral
//   with millions of likes, the food document would exceed this limit.
//   A separate collection scales infinitely.
async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

    // Check if the user has already liked this food
    const isAlreadyLiked = await likeModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadyLiked) {
      // UNLIKE: Remove like document and decrement counter atomically
      await likeModel.deleteOne({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });

      return res.status(200).json({
        success: true,
        message: "Food unliked successfully",
        action: "unliked",
      });
    }

    // LIKE: Create like document and increment counter
    const like = await likeModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Food liked successfully",
      action: "liked",
      like,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Failed to toggle like" });
  }
}


// =========================================================================
// TOGGLE SAVE/BOOKMARK ON FOOD REEL (POST /api/food/save)
// =========================================================================
// Same toggle pattern as likes. Creates or removes a save document.
async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

    const isAlreadySaved = await saveModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadySaved) {
      // UNSAVE: Remove bookmark
      await saveModel.deleteOne({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });

      return res.status(200).json({
        success: true,
        message: "Food unsaved successfully",
        action: "unsaved",
      });
    }

    // SAVE: Create bookmark
    const save = await saveModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Food saved successfully",
      action: "saved",
      save,
    });
  } catch (error) {
    console.error("Error toggling save:", error);
    res.status(500).json({ message: "Failed to toggle save" });
  }
}


// =========================================================================
// GET USER'S SAVED/BOOKMARKED FOODS (GET /api/food/save)
// =========================================================================
// Returns all food items that the current user has bookmarked.
// Uses Mongoose .populate() to resolve the food ObjectId references
// into full food documents (with video URL, name, counts, etc.)
async function getSaveFood(req, res) {
  try {
    const user = req.user;

    const savedFoods = await saveModel
      .find({ user: user._id })
      .populate({
        path: "food",
        populate: { path: "foodPartner", select: "name" }
      });

    // Filter out any saves where the food document was deleted
    const validSaves = savedFoods.filter(s => s.food !== null);

    res.status(200).json({
      success: true,
      message: "Saved foods retrieved successfully",
      savedFoods: validSaves,
    });
  } catch (error) {
    console.error("Error fetching saved foods:", error);
    res.status(500).json({ message: "Failed to fetch saved foods" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
};
