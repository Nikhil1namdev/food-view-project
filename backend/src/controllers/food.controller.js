const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");


//POST /api/food/ [protected]
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


//GET /api/food/ [protected]
//ye api normal user ke liye hai food partner ke liye nhi,jo bhi user scroll karege to jo nai nai video aayega kha se uske liye hai
// jitne bhi food items ki video hai usko leke aayegi ye api
async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems,
  });
}

async function likeFood(req, res) {
  //humko ye rakhn hai konsa user like karra or kis food ko like karra 
  const { foodId } = req.body;
  const user = req.user;
  console.log("user ye hai",user);

  const isAlreadyLiked = await likeModel.findOne({
    user: user._id,
    food: foodId,
  });
 

  if (isAlreadyLiked) {
    await likeModel.deleteOne({
      user: user._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likeCount: -1 },
    });

    return res.status(200).json({
      message: "Food unliked successfully",
    });
  }

  const like = await likeModel.create({
    user: user._id,
    food: foodId,
  });

  await foodModel.findByIdAndUpdate(foodId, {
    $inc: { likeCount: 1 },
  });

  res.status(201).json({
    message: "Food liked successfully",
    like,
  });
}

async function saveFood(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  const isAlreadySaved = await saveModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadySaved) {
    await saveModel.deleteOne({
      user: user._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { savesCount: -1 },
    });

    return res.status(200).json({
      message: "Food unsaved successfully",
    });
  }

  const save = await saveModel.create({
    user: user._id,
    food: foodId,
  });

  await foodModel.findByIdAndUpdate(foodId, {
    $inc: { savesCount: 1 },
  });

  res.status(201).json({
    message: "Food saved successfully",
    save,
  });
}

async function getSaveFood(req, res) {
  const user = req.user;

  const savedFoods = await saveModel.find({ user: user._id }).populate("food");

  if (!savedFoods || savedFoods.length === 0) {
    return res.status(404).json({ message: "No saved foods found" });
  }

  res.status(200).json({
    message: "Saved foods retrieved successfully",
    savedFoods,
  });
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
};
