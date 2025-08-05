const validator =require('validator')

const validateSignUpData = (req)=>{
    const {fullName, emailId, password}=req.body;
    if(!fullName){
        throw new Error("please fil the full name ");
    }
    else if (!validator.isEmail(emailId)){
        throw new Error("please enter a valid emailId");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("please fill strong passwword");
        
    }

}
module.exports = validateSignUpData;