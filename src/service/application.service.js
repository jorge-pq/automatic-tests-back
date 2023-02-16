const Application = require("../models/Application");

const getAll = async () => {
   let apps =  await Application.find({}).populate('tests');
   return apps;
}

const create = async (data) => {
	const app = new Application(data);
	await app.save();
}


module.exports = {
    getAll, create
}