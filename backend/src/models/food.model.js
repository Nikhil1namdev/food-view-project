const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    savesCount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        min: 0,
        default: 199,
    },
    category: {
        type: String,
        default: "Indian",
    },
    isVeg: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 4.2,
    },
})


const foodModel = mongoose.model("food", foodSchema);


module.exports = foodModel;