const User = require("../models/User")
bcrypt = require('bcryptjs');


const register = async (data) => {
    data.password = bcrypt.hashSync(data.password, 8);
    const user = new User(data);
	await user.save();
    return user;
}

const validateUser = async() => {
    
}

const validateFields = (fullname, phone, password) => {
    return fullname && phone && password
}

module.exports = {
    register,
    validateUser,
    validateFields
}