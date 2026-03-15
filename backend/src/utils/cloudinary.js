import cloudinary from "cloudinary";
import streamifier from "streamifier";

// Cấu hình Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload ảnh từ buffer (dùng với multer memoryStorage)
export const uploadImage = (buffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

//Xoá ảnh trên Cloudinary theo public_id
export const deleteImage = (publicId) => {
  return cloudinary.v2.uploader.destroy(publicId);
};
