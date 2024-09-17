import {v2 as cloudinary} from 'cloudinary';

import mongoose from "mongoose";  


export const connectDB = async () => { 
    
    try {
    await  mongoose.connect(process.env.DB_URI)  
    console.log('\x1b[35m%s\x1b[0m', 'dataBase Connected!');
    } catch (error) {
        console.log(error);
        
    }

}



          
export const cloudinaryConfig = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });
}