import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

export async function connectDb()
{
    try {
        const url = process.env.MONGODB_URI;

        await mongoose.connect(url,{dbName:'webTrack'});
        console.log("Database Connected !");
        
    } 
    catch (error) {
        console.log("Failed to connect to DB");
        throw error;
    }
}