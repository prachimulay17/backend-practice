import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // explicitly point to it

import connectdb from "./db/index.js";








connectdb();




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