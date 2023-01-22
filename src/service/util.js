const Booking = require("../models/Booking");
const {MONTH} = require('../contants');

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

const getDateRange = (type) => {
    let d = new Date();
    let range = {
        from: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0),
        to: new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, 0,0,0)
    };
    if(type===MONTH){
        range.from = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
        range.to = new Date(d.getFullYear(), d.getMonth()+1, 1, 0, 0, 0);
    }
    return range;
}

module.exports = {
    getCode, format, getDateRange
}