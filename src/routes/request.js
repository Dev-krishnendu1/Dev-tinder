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
               message:`${req.user.firstName} is ${status} in ${toUser.firstName}`,
               requestData,
          })
     }catch(err){
          res.status(400).send("Error"+err.message)
     }
})
requestRouter.post("/request/review/:status/:requestId", UserAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;
//     const { status, requestId } = req.params;
        const requestId = req.params.requestId;
        const status = req.params.status;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status is not valid" });
    }

    const request = await requestConnection.findOne({
      toUserId: loggedInUserId._id,
      _id: requestId,
      status: "interested"
    });

    if (!request) {
      return res.status(404).json({
        message: "Request is not valid!"
      });
    }

    request.status = status;
    const data = await request.save();

    return res.json({
      message: `Request has been ${status}.`,
      data: data
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message
    });
  }
});

module.exports=requestRouter