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
const validateEditProfileData=(req)=>{
    const allowed_Data = ["fullName","email","age"];

    const isAllowed_Data = Object.keys(req.body).every((field)=>
        allowed_Data.includes(field)

    )
    return allowed_Data;
}
module.exports = {
    validateSignUpData,
    validateEditProfileData    
}