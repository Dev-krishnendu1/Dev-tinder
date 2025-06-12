const express =require('express')
const databaseDb=require("./config/dataBase")
 const app=express();
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
app.use(express.json())
app.use(cookieParser())

const requestRouter=require('./routes/request');
const authRouter=require('./routes/auth');
const profileRouter=require('./routes/profile');
const userRouter=require("./routes/users");


app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);
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



