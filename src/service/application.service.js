const Application = require("../models/Application");

const getAll = async () => {
   let apps =  await Application.find({}).populate('tests');
   return apps;
}

module.exports = {
    getAll
}