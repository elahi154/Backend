const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email id is not valid ")
            }
        }
    },
    password:{
        type:String,
        required:true,
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

userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id:user._id},"Elahi@73",{expiresIn:"1d"})
    return token;
}

const User = mongoose.model("User", userSchema);
module.exports=User;