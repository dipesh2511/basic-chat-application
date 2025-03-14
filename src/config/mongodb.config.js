import mongoose from "mongoose";
import ApplicationLevelError from "../custom.error.logs.reponses/application.level.error.js"; 
export const mongoDbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MongoDB,
    });
    
    console.log("Connected to MongoDB");
    
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    throw new ApplicationLevelError("Error connecting to MongoDB", 500);
  }
};
