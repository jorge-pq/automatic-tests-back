const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;


const schema = mongoose.Schema({
	name: String,
	slug: String,
	rooms: [Object],
	images: [Object] ,
	cover: String,
	tenant: { type: ObjectId, ref: "Tenant", required: false },
})

module.exports = mongoose.model("Hotel", schema)