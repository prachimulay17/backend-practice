import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import {asyncHandeler} from "../utils/async-handeler.js"

const verifyjwt=asyncHandeler(async(req,res,next)=>{
    try {
        const token =req.cookies.accessToken||req.headers("Authorization")?.replace("Bearer ","");
    
        if(!token){
            throw new ApiError(401,"Unauthorized access, token missing");
        }
    
        const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(!decodedtoken?._id){
            throw new ApiError(401,"Unauthorized access, problem in verification");
        }
        const user=await User.findById(decodedtoken._id).select("-password -refreshToken");
    
        req.user=user;
        next();
    
    } catch (error) {
        throw new ApiError(401,"Unauthorized access, invalid Access-token");
    }

});


export  {verifyjwt};