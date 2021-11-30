const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
	name: String,
	slug: String,
	rooms: [Object] // [{ type: ObjectId, ref: "Room" }],
})

module.exports = mongoose.model("Hotel", schema)