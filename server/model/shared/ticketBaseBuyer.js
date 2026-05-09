const mongoose = require("mongoose")

const ticketBaseBuyer = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    productType:{
        type:String,
        required:true
    },
    productName:{
        type:String,
        required:true
    },
    productImages:{
        type:[String],
        required:true
    },
    companyLocation:{
        type:String,
        required:true
    },
    pricePerProduct:{
        type:Number,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        
    },
    supplyType:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model("TicketBaseBuyer", ticketBaseBuyer)