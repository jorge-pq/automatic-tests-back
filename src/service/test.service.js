const Application = require("../models/Application");
const Test = require("../models/Test");

const getAll = async () => {
	let tests =  await Test.find({});
	return tests;
}

const getById = async (id) => {
	let test =  await Test.findOne({ _id: id});
	return test;
}

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
			test.expect = data.expect,
			test.params = data.params,
			test.headers = data.headers,
			test.bodyRaw = data.bodyRaw,
			test.bodyForm = data.bodyForm
		}

		await test.save();
}

const runTests  = async (id) => {

	let result = [];
	let tests =  await Test.find({ app: id});

	tests.forEach(item => {
		switch (item.typeTest) {
			case 'STATUS':
				if(parseFloat(item.expect) === parseFloat(item.status)){
					result.push({id: item._id, description: item.description, isSuccess: true});
				}
				else{
					result.push({id: item._id, description: item.description, isSuccess: false});
				}
				break;
			case 'CONTAINS':
				if(String(item.response).includes(item.expect)){
					result.push({id: item._id, description: item.description, isSuccess: true});
				}
				else{
					result.push({id: item._id, description: item.description, isSuccess: false});
				}
				break;
			case 'EQUAL':
				if(item.response === item.expect){
					result.push({id: item._id, description: item.description, isSuccess: true});
				}
				else{
					result.push({id: item._id, description: item.description, isSuccess: false});
				}
				break;
		}
	});

	return result;
}

module.exports = {
    create,
    update,
	getAll,
	getById,
	runTests
}