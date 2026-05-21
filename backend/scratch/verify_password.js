const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('../src/models/user.model');

mongoose.connect('mongodb://localhost:27017/food-view-project').then(async () => {
    const email = "nikhilnamdev31@gmail.com";
    const user = await userModel.findOne({ email });
    if (!user) {
        console.log("User not found in DB.");
    } else {
        console.log("User found:", user.email);
        
        const isValid1 = await bcrypt.compare("123456", user.password);
        console.log("Is old password (123456) valid?", isValid1);
        
        const isValid2 = await bcrypt.compare("1234567", user.password);
        console.log("Is new password (1234567) valid?", isValid2);
        
        console.log("Raw Hashed Password in DB:", user.password);
    }
    process.exit(0);
});
