const express=require('express')

const app=express();

app.use('/about',(req,res)=>{
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
})
app.listen(7777,()=>{
     console.log("app is started http://localhost:7777");
})

