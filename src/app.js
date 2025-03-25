const express=require('express')
const databaseDb=require("./config/dataBase")
const app=express();
const {User}=require('./model/user')
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
     const dummyUser= new User(req.body);
     console.log(req.body);
 try{
     await dummyUser.save();
     res.send("data added succesfully")
 }catch(err){
     res.status(400).send("it is a bad request "+err.Massage);
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

app.patch("/user",async(req,res)=>{
     const data=req.body;
try {
     // Find a user with age 30 and replace it with the new data
     const userReplace = await User.findOneAndReplace({emailId:"krish@gmail.aeiryt"}, data, { new: false });

     // Check if a user was found and replaced
     if (!userReplace) {
         return res.status(404).send("User  not found");
     }
     console.log(userReplace);
     res.send(userReplace);
 } catch (err) {
     res.status(500).send("Something went wrong: " + err);
 }
})
app.patch("/user",(req,res)=>{

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



