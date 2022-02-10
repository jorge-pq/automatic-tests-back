const mongoose = require("mongoose")

const schema = mongoose.Schema({
	name: String,
	slug: String,
	rooms: [Object],
	images: [Object] 
})

module.exports = mongoose.model("Hotel", schema)