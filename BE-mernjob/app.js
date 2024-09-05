import express, { urlencoded } from "express"
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connection} from "./database/connection.js"
import {middleware} from "./middlewares/error.js"
import fileUpload from "express-fileupload";
import useRouter from "./routes/userRouter.js"
import jobRouter from "./routes/jobRouter.js"
import applicationRouter from "./routes/applicationRouter.js"
import { newsLetterCron } from "./automation/newsLetterCron.js";

const app = express();
config({path:"./config/config.env"})

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}));

app.use("/api/v1/user",useRouter);
app.use("/api/v1/job",jobRouter);
app.use("/api/v1/application",applicationRouter);


// newsLetterCron();
connection();
app.use(middleware)


export default app