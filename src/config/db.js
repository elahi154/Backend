const mongoose = require('mongoose');


const connectDB = async(req,res)=>{
    await mongoose.connect(process.env.MONGODB_URL);
}
module.exports=connectDB;