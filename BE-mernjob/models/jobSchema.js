import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    jobType:{
        type: String,
        require:true,
        enum: ["Full-time", "Part-time"]
    },
    location:{
        type: String,
        require:true
    },
    companyName:{
        type: String,
        require:true
    },
    introduction:{
        type:String,
    },
    resposibilities:{
        type:String,
        require: true
    },
    qualification:{
        type:String,
        require:true
    },
    offers:{
        type:String,
    },
    salary:{
        type:String,
        require:true
    },
    hiringMultipleCandidates:{
        type:String,
        default:"No",
        enum:["Yes","No"]
    },
    personalWebsite:{
        title: String,
        url:String,
    },
    jobNiche:{
        type:String,
        require:true
    },
    newsLettersSent:{
        type: Boolean,
        default:false
    },
    jobPostedOn:{
        type: Date,
        default: Date.now,
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
});

export const Job = mongoose.model("Job",jobSchema);