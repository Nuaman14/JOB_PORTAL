import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";


const userSchema = new mongoose.Schema({
    name:{
        type : String, 
        require : true,
        minLength : [3,"name cannot be less then 3 character"],
        maxLength : [30,"name cannot be more then 3 character"]
    },
    email:{
        type:String,
        require:true,
        validate:[validator.isEmail,"Please provide a valid email"]
    },
    phone:{
        type:Number,
        require:true,
    },
    address:{
        type:String,
        required:true,
    },
    niches:{
        firstNiche:String,
        secondNiche:String,
        thirsNiche:String
    },
    password:{
        type:String,
        req:true,
        minLength:[8,"minimum 8 characters require"],
        maxLength:[32,"password cannot exceed 32 character"],
        select: false
    },
    resume:{
        public_id:String,
        url: String
    },
    coverletter:{
        type : String,
    },
    role:{
        type : String,
        req : true,
        enum : ["Job-seeker","Admin"]
    },
    createdAt:{
        type : Date,
        default : Date.now,
    },
});

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.comparePassword = async function(enterPassword){
   return await bcrypt.compare(enterPassword,this.password)
}

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE,
    })
}


export const User = mongoose.model("User",userSchema)