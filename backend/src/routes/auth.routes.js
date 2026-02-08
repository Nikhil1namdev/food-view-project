//agar routes file me api crete karne ho to router create kare karne padte hai

const express = require('express');
const authController = require("../controllers/auth.controller")

const router = express.Router();

// user auth APIs
router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)



// food partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.get('/food-partner/logout', authController.logoutFoodPartner)



module.exports = router;