const dotenv = require('dotenv');
dotenv.config();

const DB = process.env.NODE_ENV.toString().trim() === 'development' ? process.env.DB_CONECTION : process.env.DB_ATLAS_CONECTION

const PREFIX = "/api/";
let JWT = {
    secret: "PeShVkYp3s6v9y$B&E)H@McQfTjWnZq4",
    options: {
        expiresIn: 60 * 60 * 24 * 365,
    }
  };

let DEFAULT_USER = {
    fullname: "Sys Admin",
    username: "admin",
    password: "admin",
    role: "super_admin"
}  

let CLOUDINARY_CONFIG = {
    NAME: process.env.ClOUDINARY_NAME,
    API_KEY: process.env.ClOUDINARY_API_KEY,
    API_SECRET: process.env.ClOUDINARY_API_SECRET,
}

module.exports = {
    DB,
    path: (value)=>`${PREFIX}${value || ''}`,
    JWT,
    DEFAULT_USER,
    CLOUDINARY_CONFIG
}