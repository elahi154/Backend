const express = require('express');
const connectDB = require('./src/config/db');
const User =require('./src/config/models/usermodel')
const bcrypt = require('bcrypt');
const { isAfter } = require('validator');
const validateSignUpData = require('./src/utils/validation');
require ('dotenv').config()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use (express.json());
app.use(cookieParser())

app.post("/register",async(req,res)=>{
    try {
        const {fullName, emailId, password} = req.body;
        if(!fullName || !emailId || !password){
            res.send("All field are required");
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
app.post("/login",async(req,res)=>{
   try {
    const {emailId, password}=req.body;

    if(!emailId || !password){
        res.send("please fill all the field");
    }
    const users = await User.findOne({emailId});
    if(!users){
        res.send("user not found please SignUp");
    }
    const checkPassword = await bcrypt.compare(password, users.password);

    if(checkPassword){
        const token = await jwt.sign({_id:users._id},"Elahi@73");
        console.log(token);
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
})
app.get("/user",async(req,res)=>{
    try {
       const userEmail = req.body.emailId;
       const users = await User.findOne({emailId:userEmail});
       if(users===0){
        res.send("Invalid email Address");
       }
       else{
        res.send(users);
       }
       
    } catch (error) {
        console.log("cant not get user",error);
    }
    
})
app.get("/user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user);
    } catch (error) {
        console.log("Error fetching user by ID:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/feed",async(req,res)=>{
    try {
        const users = await User.find({});

        res.send(users);
    } catch (error) {
        console.log("Error fetching user:", error);
        res.status(500).send("Internal Server Error");
    }
})
app.delete("/user/:userId",async(req,res)=>{
    try {
        const userId = req.params.userId;
        const userDelete = await User.findByIdAndDelete(userId)
        if(!userDelete){
            throw new Error("user does not found")
        }
        res.send("delete successfully")
    } catch (error) {
        console.log("Error fetching user:", error);
        res.status(500).send("Internal Server Error");
    }
    
})

app.patch("/user/:userId",async(req,res)=>{
    try {
        const userId = req.params.userId;
        const data = req.body;
        const allowed_Update = ["fullName", "gender", "age"];

        const isAllowed_Update = Object.keys(data).every((k)=>
            allowed_Update.includes(k)
        )
        if(!isAllowed_Update){
            res.status(400).send("UUpdate is not alowed")
        }
        const users = await User.findByIdAndUpdate(userId,data);
        res.send("Update successfully");

    } catch (error) {
        console.log("Error fetching user:", error);
        res.status(500).send("Internal Server Error");
    }
    
})








connectDB().then(()=>{
    console.log("mongodb connection successfully")
    app.listen(5000 , ()=>{
    console.log("app listen at port 5000")
})
}).catch((err)=>{
    console.log("error in mongodb connection",err)
})

