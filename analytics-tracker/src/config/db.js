import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

export async function connectDb()
{
    try {
        const url = process.env.MONGODB_URI;
        // MONGODB_URI=mongodb+srv://sameermanoj2005_db_user:jDVXajPrT2N4XGQf@cluster0.pn1tae2.mongodb.net/

        await mongoose.connect(url,{dbName:'webTrack'});
        console.log("Database Connected !");
        
    } 
    catch (error) {
        console.log("Failed to connect to DB");
    }
}