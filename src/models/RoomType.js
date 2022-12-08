const mongoose = require("mongoose")

const schema = mongoose.Schema({
	name: String,
    description: String,
    persons: Number,
	tenant: String,
})

module.exports = mongoose.model("RoomType", schema)