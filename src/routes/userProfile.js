const express = require('express');
const auth = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');

const profileRouter = express.Router();

profileRouter.get("/user/view",auth,async(req,res)=>{
    try {
       const users =  req.users;
       res.send(users);
       
    } catch (error) {
        console.log("cant not get user",error);
    }
    
});
profileRouter.patch("/profile/edit",auth,(req,res)=>{
    validateEditProfileData(req);
    if(!validateEditProfileData){
        throw new Error("Invalid Edit request");
        
    }
    const loggedInUser = req.users;
    Object.keys(req.body).forEach((keys)=>(loggedInUser[keys]=req.body[keys]))
    res.json({message:`${loggedInUser.fullName} your profile update successfully`,
    data:loggedInUser})
    
})


module.exports = profileRouter;