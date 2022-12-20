const Booking = require("../models/Booking");

const getCode = async (code) => {
   let count = await Booking.countDocuments({});
   let result = `${code}-${String(count+1).padStart(4, '0')}`
   return result;
}

const format = date => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; 
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedDate = dd + '/' + mm + '/' + yyyy;
    return formattedDate;
}

module.exports = {
    getCode, format
}