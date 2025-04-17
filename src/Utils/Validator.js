const validator = require("validator");
const ValidateSignUp=(req)=>{
     const {firstName,lastName,emailId,password}=req.body;
     if(!firstName || !lastName || !emailId|| !password){
        throw new Error("All field are required");
       }
      if(!validator.isEmail(emailId)){
          throw new Error("Enter a valid email id");
     }
     if(!validator.isStrongPassword(password)){
          throw new Error("Enter a strong password");}
     
     }
module.exports={
     ValidateSignUp
}