//const asyncHandeler=()=>{}


const asyncHandeler=(func)=>async(req,res,next)=>{

try {
    await func(req,res,next)
    return func;

} catch (error) {
    res.status(error.code|| 500)
    success:false
    message:err.message
    return null;
}

}

export {asyncHandeler}