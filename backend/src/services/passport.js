const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const userModel = require('../models/user.model');

// =========================================================================
// PASSPORT OAUTH SSO CONFIGURATION (passport.js)
// =========================================================================
// Defines strategy hooks for Google and GitHub. Statelessly routes
// verified profile parameters back to callback route endpoints.

// 1. Google OAuth Strategy Config
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
    callbackURL: "http://localhost:3000/api/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      
      if (!email) {
        return done(new Error("Email access is required from Google profile permissions."), null);
      }

      // Check if user exists by email
      let user = await userModel.findOne({ email });

      if (user) {
        // Always update to reflect the latest SSO provider used
        user.authProvider = 'google';
        user.providerId = profile.id;
        user.avatar = profile.photos?.[0]?.value || user.avatar || "";
        user.emailVerified = true;
        await user.save();
        return done(null, user);
      }

      // Create new Google SSO user
      user = await userModel.create({
        fullName: profile.displayName || "Google User",
        email: email,
        authProvider: 'google',
        providerId: profile.id,
        avatar: profile.photos?.[0]?.value || "",
        emailVerified: true
      });

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// 2. GitHub OAuth Strategy Config
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy_secret',
    callbackURL: "http://localhost:3000/api/auth/github/callback",
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // GitHub email can sometimes be hidden, extract from emails list
      let email = profile.emails?.[0]?.value;
      
      // Secondary fallback if emails not loaded immediately due to profile privacy
      if (!email) {
        email = `${profile.username}@github.com`;
      }

      let user = await userModel.findOne({ email });

      if (user) {
        // Always update to reflect the latest SSO provider used
        user.authProvider = 'github';
        user.providerId = profile.id;
        user.avatar = profile.photos?.[0]?.value || user.avatar || "";
        user.emailVerified = true;
        await user.save();
        return done(null, user);
      }

      // Create new GitHub SSO user
      user = await userModel.create({
        fullName: profile.displayName || profile.username || "GitHub User",
        email: email,
        authProvider: 'github',
        providerId: profile.id,
        avatar: profile.photos?.[0]?.value || "",
        emailVerified: true
      });

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports = passport;
