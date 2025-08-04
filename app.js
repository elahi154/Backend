const express = require('express');
const connectDB = require('./src/config/db');
const User =require('./src/config/models/usermodel')
const bcrypt = require('bcrypt')
require ('dotenv').config()

const app = express();
app.use (express.json());

app.post("/register",async(req,res)=>{
    try {
        const {fullName, emailId, password} = req.body;
        if(!fullName || !emailId || !password){
            res.send("All field are required");
        }
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






connectDB().then(()=>{
    console.log("mongodb connection successfully")
    app.listen(5000 , ()=>{
    console.log("app listen at port 5000")
})
}).catch((err)=>{
    console.log("error in mongodb connection",err)
})

