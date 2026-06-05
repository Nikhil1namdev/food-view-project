const express = require('express');
const authController = require("../controllers/auth.controller")
const passport = require('passport');
const { authUserMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// user auth APIs
router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)
router.post('/user/change-password', authUserMiddleware, authController.changePassword)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)

// food partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.get('/food-partner/logout', authController.logoutFoodPartner)

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${frontendUrl}/user/login?error=oauth_failed` 
  })(req, res, next);
}, authController.oauthSuccess)

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
router.get('/github/callback', (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  passport.authenticate('github', { 
    session: false, 
    failureRedirect: `${frontendUrl}/user/login?error=oauth_failed` 
  })(req, res, next);
}, authController.oauthSuccess)

// Unified Session Verification route
router.get('/check-auth', authController.checkAuth)

module.exports = router;