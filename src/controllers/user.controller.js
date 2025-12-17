import { asyncHandeler } from "../utils/async-handeler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiReponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const register= asyncHandeler(async(req,res)=>{
   //get user details from frontend
   //validate user details
   //check if user already exists: check username or email
   //check for images or avatar since we are making youtube like app
   //upload them to clodinary,avatar,image
   //create user object create entry in db
   //we will get response remove password and refresh token from response
   //check for user creation success or failure
   //rerturn response to frontend

    const {username,email,password}= req.body;
    if(!username || !email || !password){
        throw new ApiError(400,"All fields are required");
    }
    const existeduser =await User.findOne({$or:[{username},{email}]});
    if(existeduser){
        throw new ApiError(409,"User already exists");
    }

    const avatarlocalpath= req.files?.avatar[0]?.path;
    const imagelocalpath= req.files?.coverImage[0]?.path;

    if(!avatarlocalpath){
       throw new ApiError(400,"Avatar image is required");
    }

    const avatar =await uploadToCloudinary(avatarlocalpath);
    const coverImage = imagelocalpath ? await uploadToCloudinary(imagelocalpath) : null;

    const user=await User.create(
        {
            fullName,
            username:username.toLowerCase(),
            email,
            password,
            avatar: avatar?.url,
            coverImage: coverImage?.url||null
        }
    )

    const usercreated = await User.findById(user._id).select("-password -refreshToken");
    if(!usercreated){
        throw new ApiError(500,"User registration failed, please try again later");
    }

    res.status(201).json({
       new:ApiResponse(201,usercreated,"User registered successfully")
    });
    


})

export {register};

