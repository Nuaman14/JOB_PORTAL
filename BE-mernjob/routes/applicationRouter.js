import express from "express";
import {isAuthenticated,isAuthorized} from "../middlewares/auth.js"
import { adminGetAllApplication, deleteApplication, jobseekerGetAllApplication, postApplication } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/post/:id",isAuthenticated,isAuthorized("Job-seeker"),postApplication)
router.get("/admin/getall",isAuthenticated,isAuthorized("Admin"),adminGetAllApplication)
router.get("/jobseeker/getall",isAuthenticated,isAuthorized("Job-seeker"),jobseekerGetAllApplication);
router.delete("/delete/:id", isAuthenticated,deleteApplication)
export default router