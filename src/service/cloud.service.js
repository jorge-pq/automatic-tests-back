const cloudinary = require('cloudinary').v2;
const CONFIG = require('../config').CLOUDINARY_CONFIG;

cloudinary.config({
    cloud_name: CONFIG.NAME,
    api_key: CONFIG.API_KEY,
    api_secret: CONFIG.API_SECRET
})


const upload = async (file) => {
    const response = await cloudinary.uploader
        .upload(file, {
            folder: 'travel-app',
            public_id: `${Date.now()}`,
        })

    return response.secure_url;
}

module.exports = {
    upload
}