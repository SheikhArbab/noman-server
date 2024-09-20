import * as UT from "../types/utils/index";
import * as cloudinary from 'cloudinary'
// import path from 'path';
// import fs from 'fs';

// Expiration Date
export const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 day 

// buildSortByObject 
export const buildSortByObject = (sort: string): { [key: string]: any } => {
    const sortBy: { [key: string]: any } = {};
    if (typeof sort === 'string') {
        const sortOrder = sort.startsWith('desc') ? 'desc' : 'asc';
        const sortField = sort.replace(/^-/, '');
        sortBy[sortField] = sortOrder;
    }
    return sortBy;
};


export function getCookiesOptions() {
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

    if (process.env.NODE_ENV === 'production') {
        return {
            expires: expirationDate,
            // domain: '.vercel.app', // Update the domain to match your frontend domain
            secure: true,
            httpOnly: true,
            sameSite: 'none' as const
        };
    } else {
        return {
            expires: expirationDate,
            sameSite: 'strict' as const
        };
    }
}


// Image uploading on cloudinary
export const imageUploading: UT.ImageUploading = async ({ image, folder }) => {

    try {

        const cloudinaryResult = await cloudinary.v2.uploader.upload(image, {
            folder: 'al-quddus/imgs/' + folder,
            resource_type: "auto",
            chunk_size: 6000000,
        });

        return cloudinaryResult.secure_url;
    } catch (error) {
        console.error('Error occurred during image uploading:', error);
        throw error;
    }
};


// Function to delete an image file on cloudinary
export const deleteFile: UT.DeleteFile = async ({ file, folder, type }) => {
    try {
        // Construct the public_id of the file on Cloudinary
        const public_id = `al-quddus/${type}/${folder}/${file.split('.')[0]}`;

        if (file.split('.')[0] === "default") {
            console.log(`default can't be delete`);
        } else {

            // Delete the file from Cloudinary
            const result = await cloudinary.v2.uploader.destroy(public_id);

            // Check if the file was successfully deleted
            if (result.result === 'ok') {
                console.log(`Deleted file: ${public_id}`);
            } else {
                console.log(`Failed to delete file: ${public_id}`);
            }
        }
    } catch (error) {
        console.error(`Error deleting file: ${error}`);
        throw error;
    }
};






// Image uploading in local
// export const imageUploading: UT.ImageUploading = async ({ image, folder }) => {
//     let imageData;
//     let fileName: string;
//     let extension: string;
//     let uri: string = `${process.env.URI}/api/uploads/imgs/${folder}/`;

//     const fetch = await import('node-fetch');

//     try {
//         if (typeof image === 'string' && image.startsWith('http')) {
//             // Fetch image from URL
//             const response = await fetch.default(image);

//             const buffer = await response.buffer();
//             imageData = buffer.toString('base64');
//             extension = image.split('.').slice(-1).toString();
//             fileName = `${Date.now()}.${extension}`;
//         } else if (typeof image === 'string') {
//             const base64ToArray = image.split(';base64,');
//             imageData = base64ToArray[1];
//             const prefix = base64ToArray[0];
//             extension = prefix.replace(/^data:image\//, '');
//             fileName = `${Date.now()}.${extension}`;
//         } else {
//             throw new Error('Invalid image format');
//         }

//         // Construct the file path with the 'public' directory included
//         const imagePath = path.join(__dirname, `../../public/uploads/imgs/${folder}`, fileName);

//         // Ensure that the directory exists
//         if (!fs.existsSync(path.dirname(imagePath))) {
//             fs.mkdirSync(path.dirname(imagePath), { recursive: true });
//         }

//         // Write the file
//         fs.writeFileSync(imagePath, imageData, { encoding: 'base64' });

//         // Full URL to the uploaded image
//         const fullUrl = `${uri}${fileName}`;

//         return fullUrl;
//     } catch (error) {
//         console.error('Error occurred during image uploading:', error);
//         throw error;
//     }
// };




// Function to delete an image file in locally
// export const deleteFile: UT.DeleteFile = async ({ file, folder, type }) => {
//     try {
//         // Construct the absolute path to the file
//         const filePath = path.join(__dirname, `./public/uploads/${type}/${folder}/`, file);

//         if ("default" === file.split('.')[0]) {
//             console.log(`Default file can't be delete!`);
//             return
//         } else {
//             // Check if the file exists
//             if (fs.existsSync(filePath)) {
//                 // Delete the file
//                 fs.unlinkSync(filePath);
//                 console.log(`Deleted file: ${file}`);
//             } else {
//                 console.log(`File not found: ${file}`);
//             }
//         }
//     } catch (error) {
//         console.error(`Error deleting file: ${error}`);
//         throw error;
//     }
// };

// generate Slug
export function generateSlug(text: string): string {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}
