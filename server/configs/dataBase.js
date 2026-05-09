const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const connectDB = async() => {
     try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected ${mongoose.connection.host}`)
    }catch(error){
        console.log(error)
    }
}

module.exports = connectDB