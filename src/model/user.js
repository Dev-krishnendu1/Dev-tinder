const mongoose = require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const { Schema } = mongoose;
const userSchema = new Schema(
     {
          firstName: {
               type: String,
               required: true,
               validate:
               {
                    validator: function (v) {
                         return v.length >= 4 && v.length <= 50;
                    },
                    massage: props => `${props.value} .enter value in the given range(4-50)`

               }
          },
          lastName: {
               type: String,
               required: true,
               maxLength: 50,
               minLength: 2
          },
          emailId: {
               type: String,
               unique:true,
               required: true,
               trim: true,
               lowercase: true,
               validate(value){
                    if(!validator.isEmail(value)){
                      throw new Error("enter a valid url")
                    }  
                 }
          },
          password: {
               type: String,
               required: true,
               maxLength: 100,
               minLength: 6,
               validate(value){
                    if(!validator.isStrongPassword(value)){
                      throw new Error("enter a strong password")
                    }  
                 }
          },
          age:
          {
               type: Number,
               min: 18,
               max: 120,
          },
          skills: {
               type:[],
               validate:
               {
                    validator: function (v) {
                         return v.length <= 10
                    },
                    massage: props => `${props.value} skills should not be more than 10`
               }

          },
          data: {
               type: String,
               default: "https://img.icons8.com/?size=100&id=108652&format=png&color=000000",
               validate(value){
               if(!validator.isURL(value)){
                    throw new Error("enter a valid url")
               }  
               }
          },
          gender: {
               type: String,
               trim:true,
               validate: {
                    validator: function (v) {
                         if (!['male', 'female', 'others'].includes(v)) {
                              throw new Error("entered gender is  not valid")
                         }
                    }
               }
          }
     }, { timestamps: true })
 userSchema.methods.getJWTtoken = async function () {
     const user = this;
     if (!user) {
          throw new Error("User not found")
     }
  const token= await jwt.sign({_id:user._id},"Krish@1234",{expiresIn:"1d"});
return token;
}

userSchema.methods.ValidatePassword=async function (UserGivenPassword){
     const user=this;
     if(!user){
          throw new Error("User not found")
     }
     const isMatch=await bcrypt.compare(UserGivenPassword,user.password);
          return isMatch;
}

const User = mongoose.model('User', userSchema)
module.exports = { User }