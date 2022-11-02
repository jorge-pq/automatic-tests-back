const Booking = require("../models/Booking");

const getCode = async (code) => {
   let count = await Booking.countDocuments({});
   let result = `${code}-${count+1}`
   return result;
}

module.exports = {
    getCode
}