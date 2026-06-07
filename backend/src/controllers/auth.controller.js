const userModel = require("../models/user.model")
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// =========================================================================
// REGISTER NEW PLATFORM USER (CONSUMER ROLE)
// =========================================================================
async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required registration fields."
            });
        }

        // MongoDB check: check if user already exists
        const isUserAlreadyExists = await userModel.findOne({ email });
        if (isUserAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // MongoDB save: create user document
        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        });

        // JWT Token creation
        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set secure HttpOnly JWT cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (err) {
        console.error("Error in consumer registration controller:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error occurred during consumer onboarding."
        });
    }
}

// =========================================================================
// LOGIN PLATFORM USER (CONSUMER ROLE)
// =========================================================================
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password."
            });
        }

        // MongoDB check: verify user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password credentials."
            });
        }

        // bcrypt check: verify password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password credentials."
            });
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set secure HttpOnly JWT cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (err) {
        console.error("Error in consumer login controller:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error occurred during authentication."
        });
    }
}

// =========================================================================
// LOGOUT PLATFORM USER (CONSUMER ROLE)
// =========================================================================
// Securely clears the JWT HttpOnly cookie from the browser.
// The clearCookie options MUST match the options used when setting the cookie
// (httpOnly, sameSite) otherwise some browsers will refuse to delete it.
function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    return res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
}

// =========================================================================
// REGISTER NEW FOOD PARTNER (MERCHANT ROLE)
// =========================================================================
async function registerFoodPartner(req, res) {
    try {
        const { name, email, password, phone, address, contactName } = req.body;

        if (!name || !email || !password || !phone || !address || !contactName) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required merchant onboarding fields."
            });
        }

        // MongoDB check: check if food partner already exists
        const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
        if (isAccountAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "A merchant account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // MongoDB save: create merchant document
        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            contactName
        });

        const token = jwt.sign({
            id: foodPartner._id,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set secure HttpOnly JWT cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "Food partner registered successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name,
                address: foodPartner.address,
                contactName: foodPartner.contactName,
                phone: foodPartner.phone
            }
        });
    } catch (err) {
        console.error("Error in merchant registration controller:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error occurred during merchant onboarding."
        });
    }
}   

// =========================================================================
// LOGIN FOOD PARTNER (MERCHANT ROLE)
// =========================================================================
async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password."
            });
        }

        // MongoDB check: verify merchant account exists
        const foodPartner = await foodPartnerModel.findOne({ email });
        if (!foodPartner) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password credentials."
            });
        }

        // bcrypt check: verify password matches
        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password credentials."
            });
        }

        const token = jwt.sign({
            id: foodPartner._id,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set secure HttpOnly JWT cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Food partner logged in successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name
            }
        });
    } catch (err) {
        console.error("Error in merchant login controller:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error occurred during merchant authentication."
        });
    }
}
   
// =========================================================================
// LOGOUT FOOD PARTNER (MERCHANT ROLE)
// =========================================================================
// Same secure cookie clearing for merchant sessions.
function logoutFoodPartner(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    return res.status(200).json({
        success: true,
        message: "Food partner logged out successfully"
    });
}

// =========================================================================
// UNIFIED ACTIVE SESSION VERIFICATION
// =========================================================================
// Verifies presence and validity of JWT token from secure HttpOnly cookies.
// Checks if token owner belongs to the Normal User or Food Partner database.
// Eliminates client-side JWT local storage, preventing XSS-based hijacking.
async function checkAuth(req, res) {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(200).json({ 
            success: false,
            authenticated: false, 
            message: "No active session detected" 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 1. Check if token belongs to User collection
        let user = await userModel.findById(decoded.id).select("-password");
        if (user) {
            return res.status(200).json({
                success: true,
                authenticated: true,
                role: "user",
                user: {
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    authProvider: user.authProvider,
                    avatar: user.avatar
                }
            });
        }

        // 2. Check if token belongs to Food Partner collection
        let foodPartner = await foodPartnerModel.findById(decoded.id).select("-password");
        if (foodPartner) {
            return res.status(200).json({
                success: true,
                authenticated: true,
                role: "partner",
                user: {
                    _id: foodPartner._id,
                    email: foodPartner.email,
                    name: foodPartner.name
                }
            });
        }

        return res.status(200).json({ 
            success: false,
            authenticated: false, 
            message: "Session token matched no active profile document" 
        });

    } catch (err) {
        return res.status(200).json({ 
            success: false,
            authenticated: false, 
            message: "Session expired or invalid validation key" 
        });
    }
}

// =========================================================================
// SOCIAL SSO OAUTH SUCCESS CALLBACK ROUTE
// =========================================================================
// Triggers on verified OAuth callbacks.
// Signs stateless JWT and returns cookie before redirecting browser to frontend home.
async function oauthSuccess(req, res) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    try {
        const user = req.user;
        
        if (!user) {
            return res.redirect(`${frontendUrl}/user/login?error=oauth_profile_missing`);
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set secure HttpOnly JWT cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect back to frontend home page
        return res.redirect(`${frontendUrl}/`);
    } catch (err) {
        console.error("SSO Callback redirect error:", err);
        return res.redirect(`${frontendUrl}/user/login?error=internal_server_error`);
    }
}

// =========================================================================
// FORGOT PASSWORD
// =========================================================================
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Please provide an email address." });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "No user found with this email." });
        }

        // Generate raw token
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Hash token before saving
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
        
        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            <p>If you didn't request this, you can ignore this email.</p>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                html: message
            });

            res.status(200).json({ success: true, message: "Email sent successfully" });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return res.status(500).json({ success: false, message: "Email could not be sent" });
        }
    } catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// =========================================================================
// RESET PASSWORD
// =========================================================================
async function resetPassword(req, res) {
    try {
        // Get hashed token
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await userModel.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        // Set new password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// =========================================================================
// CHANGE PASSWORD
// =========================================================================
async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "New passwords do not match" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        const user = req.user;
        if (!user.password) {
            return res.status(400).json({ 
                success: false, 
                message: "Account was created with Google/Github. Please use Forgot Password to set a local password first." 
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (err) {
        console.error("Change password error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    checkAuth,
    oauthSuccess,
    forgotPassword,
    resetPassword,
    changePassword
}