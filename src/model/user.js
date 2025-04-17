const mongoose = require('mongoose');
const validator=require('validator');
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
               maxLength: 85
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
               default: "https://www.pexels.com/search/men/",
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
const User = mongoose.model('User', userSchema)
module.exports = { User }