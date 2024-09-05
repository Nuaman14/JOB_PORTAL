import express from "express";
import {isAuthenticated, isAuthorized } from "../middlewares/auth.js"
import { deleteJobs, getAllJobs, getASingleJob, getMyJobs, postJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/post", isAuthenticated,isAuthorized("Admin"),postJob);
router.get("/getall",getAllJobs);
router.get("/getmyjobs",isAuthenticated,isAuthorized("Admin"),getMyJobs);
router.delete("/delete/:id",isAuthenticated,isAuthorized("Admin"),deleteJobs);
router.get("/get/:id",isAuthenticated,getASingleJob);

export default router