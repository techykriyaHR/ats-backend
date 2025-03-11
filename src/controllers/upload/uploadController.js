const pool = require('../../config/db');
const cloudinary = require('cloudinary').v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// /upload/cv
exports.uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const folderName = "/ats/applicants-cv";
        const originalFilename = path.parse(req.file.originalname).name;
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'raw', 
            folder: folderName,
            public_id: originalFilename, 
            format: 'pdf',
        });

        fs.unlinkSync(req.file.path);

        res.json({ fileUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed', details: error.message });
    }
}