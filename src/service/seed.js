const User = require("../models/User");
const {register} = require('./auth.service');
const DefaultUser = require('../config').DEFAULT_USER;

const seed = async () => {
   let count = await User.countDocuments({});

    if(count===0){
       await register(DefaultUser);
    }
}

module.exports = {
    seed
}