import mongoose from "mongoose"

export const connection = () =>{
    mongoose.connect(process.env.MONGO_URI,
       { dbName: "JOB_PORTAL"}
    ).then(()=>{
        console.log("connected to Database")
    }).catch(err =>{
        console.log(`some error occured to db :${err}`)
    });
    
}