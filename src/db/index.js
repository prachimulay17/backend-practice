import mongoose from "mongoose";
import { DBNAME } from "../constant.js";  // make sure this exports a string

const connectdb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DBNAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.log("❌ error in connection", error);
        process.exit(1);
    }
};

export default connectdb;
