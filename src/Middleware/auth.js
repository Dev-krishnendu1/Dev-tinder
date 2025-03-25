const AdminAuth=(req,res,next)=>{
     const token="abc";
     const accountability=(token==="abc");
     if(!accountability){
          res.status(401).send("it is not a correct Admin")
     }
     else{
          next();
     }  
}
const UserAuth=(req,res,next)=>{
     const token="xyz";
     const accountability=(token==="xyz");
     if(!accountability){
          res.status(401).send("it is not a correct user")
     }
     else{
          next();
     }  
}
module.exports={
     AdminAuth,
     UserAuth,
}