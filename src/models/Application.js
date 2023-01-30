const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;


const schema = mongoose.Schema({
	code: String,
	name: String,
	tests: [{ type: ObjectId, ref: "Test"}]
})

module.exports = mongoose.model("Application", schema)