import { asyncHandeler } from "../utils/async-handeler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import {uploadoncloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiReponse.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";


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

    const {username,email,password,fullName}= req.body||{};
    if(!username || !email || !password || !fullName){
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

    const avatar =await uploadoncloudinary(avatarlocalpath);
    const coverImage = imagelocalpath ? await uploadoncloudinary(imagelocalpath) : null;
   if(!avatar){
    throw new ApiError(500,"Avatar upload failed, please try again later");
   }
   

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

   return res.status(201).json(
  new ApiResponse(201, usercreated, "User registered successfully")
);

});

const loginuser=asyncHandeler(async(req,res)=>{

    //get user details - email,password,username
    //validate user details
    //check if user exists with given email or username
    //compare password
    //if all good generate access token and refresh token
    //send in cookie and response
    //store refresh token in db
    //return response to frontend

    const {email,password,username}= req.body||{};
    if((!email || !username) && !password){
        throw new ApiError(400,"Email or Username and Password are required");
    }

    const user= await User.findOne({$or:[{email},{username:username?.toLowerCase()}]});
    if(!user){
        throw new ApiError(404,"User not found with given email or username");
    }

    const ispasswordmatch=await user.isPasswordCorrect(password);
    if(!ispasswordmatch){
        throw new ApiError(401,"Invalid password");
    }

    const accesstoken =await user.generateAccessToken();
    const refreshtoken =await user.generateRefreshToken();

    if(!accesstoken || !refreshtoken){
        throw new ApiError(500,"Token generation failed, please try again later");
    }

    user.refreshToken=refreshtoken;
    await user.save({validateBeforeSave:false});

    const loggedinuser=await User.findById(user._id).select("-password -refreshToken");

    const cookieoptions={
        httpOnly:true,
        secure:true
    };

    return res.status(200).cookie("refreshToken",refreshtoken,cookieoptions)
    .cookie("accessToken",accesstoken,cookieoptions)
    .json(
        new ApiResponse(200,
            {user:loggedinuser,accesstoken,refreshtoken},
            "User logged in successfully")
    );

    
});

const logoutuser= asyncHandeler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {refreshToken:undefined},
        {new:true});

        const cookieoptions={
        httpOnly:true,
        secure:true
    };


        return res.status(200).clearCookie("accessToken",cookieoptions).clearCookie("refreshToken",cookieoptions).json(
            new ApiResponse(200,null,"User logged out successfully")
        );

});

const refreshAccessToken= asyncHandeler(async(req,res)=>{
    const incomingrefreshtoken= await req.cookie.refreshToken||req.body.refreshToken;
    if(!incomingrefreshtoken){
        throw new ApiError(401,"Refresh token is required");
    }

    const decodedtoken=await jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET);
    if(!decodedtoken || !decodedtoken?.userId){
        throw new ApiError(401,"Invalid refresh token");
    }

    const user= await User.findById(decodedtoken?.userId);
    if(!user){
        throw new ApiError(404,"User not found");
    }

    if(decodedtoken!=user?.refreshToken){
        throw new ApiError(401,"Refresh token mismatch, please login again");
    }

    const accessToken= await user.generateAccessToken();
    const newRefreshToken= await user.generateRefreshToken();

    const cookieoptions={
        httpOnly:true,
        secure:true
    };

    return res.status(200).cookie("accessToken",accessToken,cookieoptions)
    .cookie("refreshToken",newRefreshToken,cookieoptions)
    .json(
        new ApiResponse(200,
            {accessToken,newRefreshToken},
            "Access token refreshed successfully")
    );  
});
    

export {
    register,
    loginuser,
    logoutuser,
    refreshAccessToken
};

