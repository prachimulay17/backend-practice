import express from "express"
import cookieparser from "cookie-parser"
import cors from "cors"

const app= express();

app.use(cors({
    origin: process.env.CORSORIGIN
    
}))

app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb", extended:true}));
app.use(cookieparser());
app.use(express.static("public"));


//routes will be here
import userRouter from "./routes/user.router.js";
app.use("/api/v1/users", userRouter);

export {app}