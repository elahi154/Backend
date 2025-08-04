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

        user.save();
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




connectDB().then(()=>{
    console.log("mongodb connection successfully")
    app.listen(5000 , ()=>{
    console.log("app listen at port 5000")
})
}).catch((err)=>{
    console.log("error in mongodb connection",err)
})

