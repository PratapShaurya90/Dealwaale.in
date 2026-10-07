const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    costPrice: {
        type: Number,
        required: true
    },
    units: {
        type: Number,
        required: true
    },
    revenue: {
        type: Number,
        required: true
    },
    profit: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        default: "Unknown"
    },
    category: {
        type: String,
        default: "General"
    }
}, { timestamps: true });

module.exports = mongoose.model("Deal", dealSchema);
