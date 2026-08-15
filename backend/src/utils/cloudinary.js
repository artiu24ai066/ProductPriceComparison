import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image buffer to Cloudinary.
 *
 * @param {Buffer} buffer   - File buffer from multer memory storage
 * @param {string} folder   - Cloudinary folder name
 * @param {string} publicId - Optional public_id (used to overwrite previous image)
 * @returns {Promise<object>} Cloudinary upload result
 */
export const uploadToCloudinary = (buffer, folder = "pricewise", publicId = undefined) => {
    return new Promise((resolve, reject) => {
        const options = {
            folder,
            resource_type: "image",
            // overwrite: true replaces the existing asset at the same public_id
            ...(publicId && { public_id: publicId, overwrite: true }),
        };

        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });

        stream.end(buffer);
    });
};
