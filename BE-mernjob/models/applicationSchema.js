import mongoose, { mongo } from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    jobSeekerInfo:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name:{
            type:String,
            require:true,
        },
        email:{
            type:String,
            required: true,
            validate:[validator.isEmail,"please provide a valid email"]
        },
        phone:{
            type:Number,
            required:true
        },
        address:{
            type: String,
            require: true,
        },
        resume:{
            public_id:String,
            url:String
        },
        coverLetter:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            enum: [ "Job-seeker" ],
            require: true
        }
    },
    adminInfo:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
        role:{
            type:String,
            enum: ["Admin"],
            required:true
        },
        
    },
    jobInfo:{
        jobId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
        },
        jobTitle:{
            type:String,
            required:true
        }
    },
    deletedBy:{
        jobSeeker:{
            type:Boolean,
            default:false,
        },
        admin:{
          type:Boolean,
          default:false,
        }
    }
});

export const Application = mongoose.model("Application",applicationSchema)