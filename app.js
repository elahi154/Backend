const express = require('express');
const connectDB = require('./src/config/db');
const User =require('./src/config/models/usermodel')
require ('dotenv').config()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authRouter = require('./src/routes/userAuth');
const profileRouter = require('./src/routes/userProfile');
const requestRouter = require('./src/routes/userRequest');


const app = express();
app.use (express.json());
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)


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

