const Booking = require("../models/Booking");

const getCode = async (code) => {
   let count = await Booking.countDocuments({});
   let result = `${code}-${String(count+1).padStart(4, '0')}`
   return result;
}

module.exports = {
    getCode
}