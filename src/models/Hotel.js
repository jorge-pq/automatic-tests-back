const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;


const schema = mongoose.Schema({
	code: String,
	name: String,
	slug: String,
	country: String,
	state: String,
	city: String,
	zipCode: String,
	address: String,
	active: { type: Boolean, default: false},
	rooms: [Object],
	images: [Object],
	cover: String,
	tenant: { type: ObjectId, ref: "Tenant", required: false },
})

module.exports = mongoose.model("Hotel", schema)