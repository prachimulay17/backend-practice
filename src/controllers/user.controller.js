import { asyncHandeler } from "../utils/async-handeler.js";



const register= asyncHandeler(async(req,res)=>{
    res.status(200).json({
        sucess:true,
        message:"User registered successfully"
    })
})

export {register};