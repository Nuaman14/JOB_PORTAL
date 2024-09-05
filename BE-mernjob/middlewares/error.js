class ErrorHandler extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode=statuscode;
    }}

    export default ErrorHandler;

    export const middleware = (err,req,res,next) =>{
            err.statuscode = err.statuscode || 500;
            err.message = err.message || "Internal server error";

            if(err.name === "casterror"){
               const message = `Invalids ${err.path}`;
               err = new ErrorHandler(message,400)
            }
            if(err.code === 11000){
                const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
            }
            if(err.name === "JsonwebTokenError"){
                const message = `Json web token is invalid, try again `;
                err = new ErrorHandler(message,400)
             }
             if(err.name === "TokenExpiredToken"){
                const message = `Web token is expired, login again`;
                err = new ErrorHandler(message,400)
             }

            return res.status(err.statuscode).json({
                success:false,
                message:err.message,
            })
    }
