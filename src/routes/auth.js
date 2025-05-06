const express=require('express');
const authRouter=express.Router();
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const {ValidateSignUp}=require("../Utils/Validator");
const {User}=require('../model/user');


authRouter.post("/signup", async (req, res) => {
     try {
         const { firstName, lastName, emailId, password } = req.body;
 
         // Validate the data
         ValidateSignUp(req);
 
         // Check if user already exists
 
         // Encrypt the password
         const passwordHash = await bcrypt.hash(password, 10);
 
         // Create a new user instance
         const newUser  = new User({ firstName, lastName, emailId, password: passwordHash });
         await newUser .save();
 
         res.status(201).send("User  added successfully");
     } catch (err) {
         res.status(400).send("It is a bad request: " + err.message);
     }
 });
authRouter.post("/login",async(req,res)=>{
     try{
          const {emailId,password}=req.body;
          const user=await User.findOne({emailId})
          if((!user)){
               throw new Error("INVALID CREDENTIALS")
          }
          const matchpassword=await user.ValidatePassword(password);
          if(matchpassword){
               const token=await user.getJWTtoken();
               //  console.log(token);
               res.cookie("token",token,{expires:new Date(Date.now()+8*360000)});
               res.send("login successfull")
          }
          else{
               throw new Error("INVALID CREDENTIALS");
          }
     }catch(e){
          res.status(400).send(" error in login "+e);
     }
})
authRouter.post("/logout",async(req,res)=>{
   res.cookie("token",null,
     {expires:new Date(Date.now())}) 
     res.send("logout successfully");
})
 module.exports=authRouter