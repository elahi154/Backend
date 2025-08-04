const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        require:true,
    },
    emailId:{
        type:String,
        require:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email id is not valid ")
            }
        }
    },
    password:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("plese add strong password");
            }
        }

    },
    age:{
        type:Number,
    }
},{timestamps:true})

const User = mongoose.model("User", userSchema);
module.exports=User;