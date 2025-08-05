const express = require('express');
const validateSignUpData = require('../utils/validation');
const User = require('../config/models/usermodel');
const bcrypt = require('bcrypt')

const authRouter = express.Router();

authRouter.post("/register",async(req,res)=>{
    try {
        const {fullName, emailId, password} = req.body;
        if(!fullName || !emailId || !password){
           return res.send("All field are required");
        }
        validateSignUpData;
        const hashPassword = await bcrypt.hash(password,10);
        const user = new User({
            fullName,
            emailId,
            password:hashPassword,
        })

       await user.save();
        res.send("user added successfully");
    } catch (error) {
        console.log("Something went wrong",error);
    }
});
authRouter.post("/login",async(req,res)=>{
   try {
    const {emailId, password}=req.body;

    if(!emailId || !password){
       return res.send("please fill all the field");
    }
    const users = await User.findOne({emailId});
    if(!users){
        res.send("user not found please SignUp");
    }
    const checkPassword = await bcrypt.compare(password, users.password);

    if(checkPassword){
        const token = await users.getJWT();
        
        res.cookie ("token",token)
        res.send("Login sucessfully");
    }
    else{
        res.send("Invalid credintial");
    }
    
   } catch (error) {
     console.log("Error fetching user:", error);
        res.status(500).send("Internal Server Error");
   }
});

authRouter.post('/logout',async(req,res)=>{
    res.cookie("token",null, {
        expires:new Date (Date.now())
    })
    res.send("Logout successfully!!!")
})

module.exports=authRouter;