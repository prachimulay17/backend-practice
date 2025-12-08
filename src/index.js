import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // explicitly point t0o the .env file
import connectdb from "./db/index.js";








connectdb();
then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log("process running on :", $(PORT));
        

    })
})
.catch ((error)=>{ 
    console.log("connection with database failed");
    
})


/*
;(async () =>{
try{
 await mongoose.connect('{process.env.MONGODB_URI}/${DBNAME}');

app.Listen ( process.env.PORT,()=>{
    console.log("app running on port:",$(process.env.PORT));
})
}
catch(error){
    console.log("eroor occured during connection",error);
}

})()
*/