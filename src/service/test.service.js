const Application = require("../models/Application");
const Test = require("../models/Test");

const create = async (appId, data) => {
    const app = await Application.findOne({ _id: appId });
	const test = new Test(data);
	test.app = app;
	await test.save();
	await Application.updateOne({_id: appId}, {'$push':  {tests: test}})
}

const update = async (id, data) => {
		const test = await Test.findOne({ _id: id })

		if (data.description && data.url) {
			test.description = data.description;
			test.url = data.url;
			test.method = data.method;
			test.typeTest = data.typeTest,
			test.expect = data.expect
		}

		await test.save();
}

module.exports = {
    create,
    update
}