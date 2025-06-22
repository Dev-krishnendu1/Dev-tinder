const express=require('express');
const { UserAuth } = require('../Middleware/auth');
const requestConnection = require('../model/ConnectionRequest');
const {User}=require("../model/user")
const userRouter=express.Router();

userRouter.get("/user/request/received",UserAuth,async(req,res)=>{
    try {
          const loggedInUser=req.user;
          const requestCon=await requestConnection.findOne({
              toUserId:loggedInUser._id,
              status:"interested"
          }).populate("fromUserId",["firstName","lastName"])
          res.json({
              message:"Data fetched succesfully",
              data:requestCon
          })
    } catch (error) {
        res.status(404).json({
          message:"Error "+error
        })  
    }
})
userRouter.get("/user/connections", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await requestConnection.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
      ]
    })
      .populate("fromUserId", "firstName lastName skills")
      .populate("toUserId", "firstName lastName skills");

    const data = connections.map((row) =>
      row.toUserId._id.equals(loggedInUser._id)
        ? row.fromUserId
        : row.toUserId
    );
    res.json({ data });
  } catch (error) {
    res.status(400).json({ message: "Error: " + error.message });
  }
});
userRouter.get("/feed",UserAuth,async(req,res)=>{
  try {
  const page=parseInt(req.query.page)||1;
  let limit=parseInt(req.query.limit)||10;
  const skip=(page-1)*limit;
  limit=limit>20?20:limit;

    const loggedInUser=req.user;
      const connectionRequest=await requestConnection.find({
              $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
          }).select("toUserId fromUserId")
        const hideUserFeed=new Set();
        connectionRequest.forEach(request => {
          hideUserFeed.add(request.fromUserId.toString());
          hideUserFeed.add(request.toUserId.toString());
        });
        // console.log(hideUserFeed);
       const feedUser =await User.find({ $and:[{_id:{$nin:Array.from(hideUserFeed)}},
        {_id:{$ne:loggedInUser._id}}
       ]
      }).select("firstName lastName age gender skills")
      .skip(skip)
      .limit(limit);

          res.send(feedUser);
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})
module.exports=userRouter;