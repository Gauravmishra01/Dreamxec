const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath
 * @param {string} folder
 * @param {'image' | 'video' | 'raw'} resourceType
 */
module.exports = async function uploadToCloudinary(
  filePath,
  folder,
  resourceType = "image"
) {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: false,
    });

    fs.unlinkSync(filePath);
    return res.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw new Error("Cloudinary upload failed");
  }
};
