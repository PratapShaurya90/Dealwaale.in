const mongoose = require("mongoose")

const user = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        maxLength:10,

    },
    city:{
        type:String,
        required:true
    },
    profession:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["seller","buyer"],
        required:true
    },
    subscriptionType:{
        type:String,
        enum:["basic","pro"],
        default:"basic"
    },
    about: {
        type: String,
        default: "Leading dealer in high-quality products and services."
    },
    categories: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model("User",user)