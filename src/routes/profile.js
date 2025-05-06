const express=require('express');
const bcrypt=require('bcrypt');
const validator = require("validator");
const profileRouter=express.Router();
const {UserAuth} =require('../Middleware/auth');
const { ValidateProfileEdit } = require('../Utils/Validator');
const {User}=require("../model/user");
profileRouter.get("/profile/view",UserAuth,async(req,res)=>{
     try{
          const user=req.user;
          res.send(user);
}catch(err){
     res.status(400).send("error in loading the profile "+err);
}
})
profileRouter.patch("/profile/edit",UserAuth,async(req,res)=>{
     try{
       if(!ValidateProfileEdit(req)){
          throw new Error("Not a valid request.")
       }
       const loggedInUser=req.user;
       Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key])
       console.log(loggedInUser);
       res.send(`Ms.${loggedInUser.lastName} your profile updated succesfully.`)
     }catch(err){
          res.status(400).send("Cann't be edited"+err)
     }
})
profileRouter.patch("/profile/password",UserAuth,async(req,res)=>{
     try{
          const user = req.user;
          const { newPassword } = req.body; 
   if(!user){
     throw new Error("Please login first");
   }
   if(!validator.isStrongPassword(newPassword)){
     throw new Error("Enter a strong password");
   }
   const passwordHashNew=await bcrypt.hash(newPassword, 10);
   user.password=passwordHashNew;  
   await user.save();
  res.send("password updated succesfully.")
}catch(e){
res.status(400).send("Internal server error! "+e)
}
})
module.exports=profileRouter