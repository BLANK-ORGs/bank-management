import mongoose from "mongoose";
import logger from "./logger.js";

export const dbConnect = async() =>{
    try {
         await mongoose.connect(process.env.MONGODB_URI);
         logger.info("Database Connected")
        
    } catch (error) {
        console.log(error);
    }
};