import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {Application} from "../models/applicationSchema.js"
import {Job} from "../models/jobSchema.js";
import {v2 as cloudinary} from "cloudinary"

export const postApplication = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    const {name,email,phone,address,coverLetter} = req.body;

    if(!name || !email || !phone || !address || !coverLetter){
        return next(new ErrorHandler("All field sre required"),400)
    }
   
    const jobSeekerInfo = {
        id: req.user._id,
        name,
        email,
        phone,
        address,
        coverLetter,
        role:"Job-seeker",
    };
    const jobDetails = await Job.findById(id);
    if(!jobDetails){
        return next(new ErrorHandler("Job not Found",404));
    }
    const isAlreadyApplied = await Application.findOne({
        "jobInfo.id":id,
        "jobSeekerInfo.id":req.user._id
      });
      if(isAlreadyApplied){
        return next(new ErrorHandler("You have already applied for this job.",400));
      }
    if(req.files && req.files.resume){
        const { resume } = req.files;
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(resume.temp,{
                folder:"Job_Seekers_Resume"
            });
            if(!cloudinaryResponse || cloudinaryResponse.error){
                return next(new ErrorHandler("failed to upload resume to cloudinary.",500))
            }
            jobSeekerInfo.resume={
                public_id:cloudinaryResponse.public_id,
                url:cloudinaryResponse.secure_url
            }
        } catch (error) {
            return next(new ErrorHandler("failed to upload resume",500));
        }
    }
    else{
        if(req.user && !req.user.resume.url){
            return next(new ErrorHandler("Please upload your resume", 400));
        }
        
        jobSeekerInfo.resume = {
            public_id: req.user && req.user.resume.public_id,
            url: req.user && req.user.resume.url,
        }
    }
    const adminInfo = {
        id: jobDetails.postedBy,
        role:"Admin"
    };
    const jobInfo = {
        jobId : id,
        jobTitle: jobDetails.title
    };

    const application = await Application.create({
        jobSeekerInfo,
        adminInfo,
        jobInfo,
    });
    res.status(201).json({
        success:true,
        message:"Application submitted",
        application,
    });


});


export const adminGetAllApplication = catchAsyncError(async(req,res,next)=>{
    const {_id} = req.user;
    const applications = await Application.find({
        "adminInfo.id": _id,
        "deletedBy.admin":false,
    });
    res.status(200).json({
        success:true,
        applications,
    });
});

export const jobseekerGetAllApplication = catchAsyncError(async(req,res,next)=>{
    const {_id} = req.user;
    const applications = await Application.find({
        "jobSeekerInfo.id": _id,
        "deletedBy.jobSeeker":false,
    });
    res.status(200).json({
        success:true,
        applications,
    });
});


export const deleteApplication = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    const application = await Application.findById(id);
    if(!Application){
        return next(new ErrorHandler("Application not found",404));
    }
    const {role}=req.user;
    switch (role) {
        case "Job-seeker":
            application.deletedBy.jobSeeker = true;
            await application.save()
            break;
        case "Admin":
            application.deletedBy.admin = true;
            await application.save()
            break;
    
        default:
            console.log("default case for application delete")
            break;
    };
    if(application.deletedBy.employer === true && application.deletedBy.jobSeeker === true){
       await application.deleteOne();
    }
    res.status(200).json({
        success:true,
        message: "Application Deleted",
    });
});