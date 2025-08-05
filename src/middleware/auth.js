const jwt = require('jsonwebtoken');
const User = require('../config/models/usermodel');


const auth = async(req,res,next)=>{
try {
        const {token} = req.cookies;
    if(!token){
        res.send("token invalid");
    }
    const decodedMessage = await jwt.verify(token, "Elahi@73");
    const {_id}=decodedMessage;
    const users = await User.findById({_id});
    if(!users){
        res.send("Invalid users");
    }
    req.users = users;
    next();
} catch (error) {
    console.log("something error",error);
}
}
module.exports = auth;