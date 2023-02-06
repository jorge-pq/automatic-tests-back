const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;


const schema = mongoose.Schema({
	description: String,
	url: String,
	method: String,
	typeTest: String,
	expect: String,
	response: String,
	app: { type: ObjectId, ref: "Application" },
})

module.exports = mongoose.model("Test", schema)