const express=require('express')
const bcrypt=require('bcrypt')
const databaseDb=require("./config/dataBase")
const app=express();
const {User}=require('./model/user')
const {ValidateSignUp}=require("./Utils/Validator")
app.use(express.json())
/*app.use('/about',(req,res)=>{
     res.send("Request has been send to me now")
})
app.use('/get',(req,res)=>{
     res.send("Request is got by the server")
})
app.use("/todo",(req,res)=>{
     res.send("todo list has been send");
})
app.use("/test",(req,res)=>{
     res.send("testing the app");
})
app.use("/hello",(req,res)=>{
     res.send("Hello from the app");
})*/

/*
// working in router and hadling routers
app.get('/user',(req,res,next)=>{
console.log("Requseting the first response");
// res.send("Response 1!")
next();
},
[(req,res,next)=>{
     console.log("Requseting the second response");
     // res.send("response 2!")
     next();
},
(req,res,next)=>
{
     console.log("Requseting third response");
     // res.send("response 3!")
     next();
},
(req,res,next)=>{
     console.log("requesting 4th response");
     res.send("sending 4th response");
}])
*/
// route handling independently
/*
app.get(
     "/user",(req,res,next)=>{
          console.log("Request 1st");
          next();
     }
)
app.get("/user",(req,res,next)=>{
     console.log("calling request 2");
     // res.send("response!");
     next();
},
(req,res)=>{
     console.log("sending 3rd requset");
     res.send("response 3 ")
}
)
*/
/*
//Middleware
app.use("/admin",AdminAuth)
// app.use("/user",UserAuth);
app.use("/user/login",(req,res)=>{
     res.send("Login in the web page")
})
app.use("/user",UserAuth,(req,res)=>{
     res.send("user Data from user")
})
app.use("/admin/alluse",(req,res)=>{
     res.send("all data are send.")
})
app.use("/admin/delete",(req,res)=>{
          res.send("All data are deleted")
})
*/
/*
//Error handling



app.use("/userData",(req,res)=>{
      try{
          throw new Error("theyare =not nsD");
          res.send("resuwlgrankj")
     }
     catch(err){
          res.status(500).send("it is a bad request too");
     }
})
app.use("/",(err,req,res,next)=>{
     if(err){
          res.status(500).send("it is a bad request");
     }
})
     */

app.post("/signup",async(req,res)=>{
     try{
     const {firstName,lastName,emailId,password}=req.body
     //validate the data
     ValidateSignUp(req);
     //Encrypt the password
     const passwordHash=await bcrypt.hash(password,10);
     console.log(passwordHash);
     // req.body.password=passwordHash;
     const dummyUser=User({firstName,lastName,emailId,password:passwordHash});
     await dummyUser.save();
     res.send("data added succesfully")
 }catch(err){
     res.status(400).send("it is a bad request "+err);
 }
    
})
app.post("/login",async(req,res)=>{
     try{
          const {emailId,password}=req.body;
          const user=await User.findOne({emailId})
          if((!user)){
               throw new Error("INVALID CREDENTIALS")
          }
          const matchpassword=await bcrypt.compare(password,user.password);
          if(!matchpassword){
               throw new Error("INVALID CREDENTIALS")
          }
          else{
               res.send("login successfull")
          }
     }catch(e){
          res.status(400).send(" error in login "+e);
     }
})
app.get("/users",async(req,res)=>{
     try{
          const userEmail=req.body.emailId;
          const user=await User.find({emailId:userEmail});
          console.log(user);
          res.send(user);

     }catch(err){
          res.status(404).send("error in loading");
     }
 
})
app.get("/alluser",async(req,res)=>{
     try{
          const user=await User.find({})
          res.send(user)
     }
     catch(err){
          res.status(404).send("error in loading");
     }
})

app.get("/user",async(req,res)=>{
     try {
          const user=await User.findOne({emailId:req.body.emailId})
          res.send(user)
     } catch (error) {
          res.status(404).send("something went wrong")
     }
     
})

app.delete("/user",async(req,res)=>{
     try{
   const userId=req.body.userId;
    const user=await User.findByIdAndDelete(userId)
    res.send("data deleted succesfully");
     }catch(err){
      res.status(400).send("Bad request");
     }
})

app.put("/user",async(req,res)=>{
     const data=req.body;
try {
     const userReplace = await User.findOneAndReplace({emailId:"krish@gmail.aeiryt"}, data, { new: false });
     if (!userReplace) {
         return res.status(404).send("User  not found");
     }
     console.log(userReplace);
     res.send(userReplace);
 } catch (err) {
     res.status(500).send("Something went wrong: " + err);
 }
})
app.patch("/user",async(req,res)=>{
     const data=req.body;
try{
   const newUser= await User.findOneAndUpdate({age:30},data,{new:true,runValidators:true});
    res.send(newUser);
} catch(err){
     res.status(404).send("something went wrong");
}
})
app.patch("/user/:userId",async(req,res)=>{
const userId=req.params?.userId;
const data=req.body;
try {
  const ALLOWED_UPDATES=['gender','skill','data','password'];
  const UPDATE_ALLOWED=Object.keys(data).every((k)=>
     ALLOWED_UPDATES.includes(k))
  if(!UPDATE_ALLOWED){
     throw new Error("Cannnot update this")
  }
  const user=await  User.findByIdAndUpdate({_id:userId},data,{returnDocument:"after",runValidators:true})
  console.log(user);
  res.send("Data updated succesfully")
  }
   catch (error) {
     res.status(404).send("update failed"+err)
}
})

databaseDb().
then(()=>{
console.log("App is connected to db")
app.listen(7777,()=>{
     console.log("app is started http://localhost:7777");
})
})
.catch((err)=>{
     console.error("cannot load the db");
})



