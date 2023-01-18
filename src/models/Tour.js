const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;


const schema = mongoose.Schema({
	code: String,
	category: String,
	name: String,
	description: String,
	slug: String,
	country: String,
	state: String,
	city: String,
	zipCode: String,
	address: String,
	active: { type: Boolean, default: false},
	details: [Object],
	images: [Object],
	cover: String,
	tenant: { type: ObjectId, ref: "Tenant", required: false },
})

module.exports = mongoose.model("Tour", schema)