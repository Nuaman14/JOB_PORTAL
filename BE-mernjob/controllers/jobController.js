import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/userSchema.js";
import {Job} from "../models/jobSchema.js";

export const postJob = catchAsyncError(async(req,res,next)=>{
    const{title,jobType,location,companyName,introduction,resposibilities,qualification,offers,salary,hiringMultipleCandidates,personalWebsiteTitle,personalWebsiteUrl,jobNiche,newsLettersSent} = req.body;
    if(!title || !jobType || !location || !companyName || !introduction || !resposibilities || !qualification  || !salary  || !jobNiche ){
      return next(new ErrorHandler("Please provide full job detail",400))
    }
    if((personalWebsiteTitle && ! personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)){
        return next(new ErrorHandler("Provide both the website url and title or leave both blank.",400))
    }

    const postedBy = req.user._id;
    const job = await Job.create({
        title,jobType,location,companyName,introduction,resposibilities,qualification,offers,salary,hiringMultipleCandidates,personalWebsite:{title:personalWebsiteTitle,url:personalWebsiteUrl},jobNiche,newsLettersSent,postedBy
    });
    res.status(201).json({
        sucess: true,
        message:"Job posted successfully.",
        job,
    })
});

export const getAllJobs = catchAsyncError(async(req,res,next)=>{
    const {city,niche,searchkeyword} = req.query;
    const query = {};
    if(city){
        query.location = city;
    }
    if (niche){
        query.jobNiche = niche;
    }
    if(searchkeyword){
        query.$or = [
            {title : {$regex: searchkeyword,$options:"i"}}, 
            {companyName : {$regex: searchkeyword,$options:"i"}}, 
            {introduction : {$regex: searchkeyword,$options:"i"}}, 
        ]
    }
    const jobs= await Job.find(query);
    res.status(200).json({
        success:true,
        jobs,
        count:jobs.length
    });
})


export const getMyJobs = catchAsyncError(async(req,res,next)=>{
   const myJobs = await Job.find({ postedBy:req.user._id });
   res.status(200).json({
    success:true,
    myJobs,
   });
});
export const deleteJobs = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    const job = await Job.findById(id);
    if(!job){
        return next (new ErrorHandler("Oops! Job not found", 404));
    }
    await job.deleteOne();
    res.status(200).json({
        success:true,
        message:"Job deleted",
    })

})


export const getASingleJob = catchAsyncError(async(req,res,next)=>{
  const {id} = req.params;
  const job = await Job.findById(id);
  if(!job){
      return next (new ErrorHandler(" Job not found", 404));
  }
  res.status(200).json({
    success: true,
    job,
  });
})