const mongoose=require('mongoose')
const requestConnectionSchema=new mongoose.Schema(
     {
          fromUserId:{
               type:mongoose.Schema.Types.ObjectId,
               required:true
          },
          toUserId:{
               type:mongoose.Schema.Types.ObjectId,
               required:true
          },
          status:{
           type:String,
           enum:{
               values:['ignored','interested','accepted','rejected'],
               message:`{VALUE} status is not defined.`
           },
           required:true
          }
     },{timestamps:true}
)
requestConnectionSchema.pre("save",function(next){
    const request=this;
     if(request.fromUserId.equals(request.toUserId)){
          throw new Error("Cannot send connection request to yourself")
     }
     next();
})
requestConnectionSchema.index({fromUserId:1,toUserId:1})
const requestConnection=new mongoose.model('requestConnection',requestConnectionSchema)
module.exports=requestConnection;