const express=require('express');
const requestRouter=express.Router();
const {User}=require('../model/user');
const {UserAuth}=require('../Middleware/auth');
const requestConnection = require('../model/ConnectionRequest');
requestRouter.post("/request/send/:status/:toUserId",UserAuth,async(req,res)=>{
     try{
          const fromUserId=req.user._id;
          const toUserId=req.params.toUserId;
          const status=req.params.status;
          const isAllowed=['interested','ignored']
          if(!isAllowed.includes(status)){
               return res.status(400).json({
                    message:`{VALUE} status in not valid`
               })
          }
const alreadyExistRequest=await requestConnection.findOne(
               {
                    $or:[
                         {fromUserId,toUserId },
                         {fromUserId:toUserId,toUserId:fromUserId}
                    ]
               }
          )
          if(alreadyExistRequest){
               return res.status(400).json({
                    message:`Connection request already exist`
               })
          }
          const toUser = await User.findById(toUserId);
          if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
          }
          
          const Connection=new requestConnection({
               fromUserId,
               toUserId,
               status,
          })
         
         
          const requestData=await Connection.save();
          res.json({
               message:`${req.user.firstName} is ${status} ${toUser.firstName}`,
               requestData,
          })
     }catch(err){
          res.status(400).send("Error"+err.message)
     }
})
module.exports=requestRouter