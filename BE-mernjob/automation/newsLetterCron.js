import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import {sendEmail} from "../utils/sendEmail.js"


export const newsLetterCron = () =>{
    cron.schedule("* * * * *",async()=>{
       const jobs = await Job.find({newsLettersSent: false});
       for(const job of jobs){
        try {
            constfilteredUsers = await User.find({
                $or:[
                    {"niches.firstNiches": job.jobNiche},
                    {"niches.secondNiches": job.jobNiche},
                    {"niches.thirdNiches": job.jobNiche}
                ]
            })
            for(const user of filteredUsers){
                const subject = `Hot Job Alert: ${job.title} in ${job.jobNiche} Available Now`;
                const message = `Hi ${user.name},\n\nGreat news! A new job that fits your niche just been
                 posted. The position is for a ${job.title} with ${job.companyName}, and they are looking to hire 
                 immediately . \n\n Job Detail:\n- **Position** ${job.title}\n- **Company**${job.companyName}\n- 
                 **Location** ${job.location}\n-**Salary** ${job.salary}\n\n Don't wait too long! Job openings 
                 like these are filled quickly. \n\n We're here to support you in your job search. Best of luck!
                 \n\n Best Regards,\nNicheNest Team`;
                sendEmail({
                    email:user.email,
                    subject,
                    message
                });
            }
            job.newsLettersSent=true;
            await job.save();
        } catch (error) {
            console.log("ERROR IN NODE CRON CATCH BLOCK");
            return next(console.error(error || "Some error in cron"));
        }
       }
    });
};