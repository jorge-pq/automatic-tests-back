const dotenv = require('dotenv');
dotenv.config();

const DB = process.env.NODE_ENV === 'development' ? process.env.DB_CONECTION : process.env.DB_ATLAS_CONECTION

module.exports = {
    DB
}