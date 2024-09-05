import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/userSchema.js";
import {v2 as cloudinary} from "cloudinary"
import {sendToken} from "../utils/jwtToken.js"

export const register = catchAsyncError(async (req, res, next) => {
    console.log("Request received:", req.body);  // Log request body
  
    try {
      const { name, email, phone, address, password, role, firstNiche, secondNiche, thirdNiche, coverLetter } = req.body;
  
      if (!name || !email || !address || !password || !role) {
        console.log("Missing required fields");  // Log if missing fields
        return next(new ErrorHandler("All fields are required", 400));
      }
  
      if (role === "Job-seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
        console.log("Missing niches for job seeker");  // Log if missing niches
        return next(new ErrorHandler("Please provide your preferred niches", 400));
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("User already exists");  // Log if user already exists
        return next(new ErrorHandler("Given email is already registered", 400));
      }
  
      const userData = { name, email, phone, address, password, role, niches: { firstNiche, secondNiche, thirdNiche }, coverLetter };
  
      if (req.files && req.files.resume) {
        const { resume } = req.files;
        if (resume) {
          try {
            const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "Job_Seekers_Resume" });
            if (!cloudinaryResponse || cloudinaryResponse.error) {
              console.log("Failed to upload resume");  // Log if Cloudinary upload fails
              return next(new ErrorHandler("Failed to upload resume to cloud", 500));
            }
            userData.resume = {
              public_id: cloudinaryResponse.public_id,
              url: cloudinaryResponse.secure_url,
            };
          } catch (error) {
            console.log("Error uploading resume:", error);  // Log Cloudinary upload error
            return next(new ErrorHandler("Failed to upload resume", 500));
          }
        }
      }
  
      const user = await User.create(userData);
      sendToken(user,201,res,"user Register succesfully")
     
    } catch (error) {
      console.log("Error occurred:", error);  // Log any other errors
      next(error);
    }
  });
  


  export const login = catchAsyncError(async(req,res,next)=>{
    const {role,email,password} = req.body;
    if(!role || !email || !password) {
        return next(
            new ErrorHandler("Email, password and role are required.", 400)
        );
    }
    const user = await User.findOne({ email }).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or paswword.", 400))
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or paswword.", 400));
    }
    if(user.role !== role){
        return next(new ErrorHandler("Invalid email or paswword.", 400));
    }
    sendToken(user,200,res,"User Logged in Successfully")
  });


  export const logout= catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("token","",{
        expires: new Date( Date.now()),
        httpOnly: true,
    }).json({
        success:true,
        message: "Logged out successfully."
    })
  });

  export const getUser = catchAsyncError(async(req,res,next) =>{
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
  });

  export const updateProfile = catchAsyncError(async(req,res,next) =>{
     const newUserData={
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        coverLetter:req.body.coverLetter,
        niches:{
            firstNiche:req.body.firstNiche,
            secondNiche:req.body.secondNiche,
            thirdNiche:req.body.thirdNiche,
        }
     }
     const{firstNiche,secondNiche,thirdNiche} = newUserData.niches;

     if (req.user.role === "Job-seeker" && (!firstNiche || !secondNiche || !thirdNiche)){
        return next(new ErrorHandler("please provide your all preferred niche",400))
     }
     if (req.files){
        const resume = req.files.resume;
        if(resume){
            const currentResumeId = req.user.resume.public_id;
            if(currentResumeId){
                await cloudinary.uploader.destroy(currentResumeId);
            }
            const newResume = await cloudinary.uploader.upload(resume.tempFilePath,{
                folder:"Job_Seekers_Resume"
            });
            newUserData.resume ={
                public_id:newResume.public_id,
                url: newResume.secure_url,
            };
        }
     }


     const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
        useFindModify: false,
     });
     res.status(200).json({
        success:true,
        user,
        message: "Profile updated",
     })
  });

  export const updatePassword = catchAsyncError(async(req,res,next) =>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next (new ErrorHandler("old Password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next (new ErrorHandler("New password & confirm password do not match",400))
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res,"Password updated successfully");
  });

  