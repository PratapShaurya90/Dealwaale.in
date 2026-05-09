const mongoose = require("mongoose")

const rating = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    rating:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("Rating",rating)
