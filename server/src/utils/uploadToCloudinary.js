const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async function uploadToCloudinary(filePath,folder) {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: folder,
    });

    fs.unlinkSync(filePath); 
    console.log("Cloudinary Upload Success:", res);
    return res.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw new Error("Cloudinary upload failed");
  }
};
