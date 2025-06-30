const jwt=require('jsonwebtoken');
const { User } = require('../model/user');
const UserAuth=async(req,res,next)=>{
   try{
     const {token}=req.cookies;
     if(!token){
        return res.status(401).send("You are not logged in")
     }
     const decodedToken=jwt.verify(token,"Krish@1234");
     const {_id}=decodedToken;
     const user=await User.findById({_id});
     if(!user){
          throw new Error("User not found");
     }
     req.user=user;
          next();
   }catch(err){
          res.status(400).send("Unauthorized: "+err);
   } 
}
module.exports={
     UserAuth,
}