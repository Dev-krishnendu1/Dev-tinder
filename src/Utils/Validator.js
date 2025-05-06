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
const ValidateProfileEdit=(req)=>{
     const canEditField=[
          'firstName',
          'lastName',
          'age',
          'photoUrl'
          ,'skills']
    const isEditPossible=Object.keys(req.body).every((field)=>canEditField.includes(field));
    return isEditPossible;
}
module.exports={
     ValidateSignUp,
     ValidateProfileEdit
}