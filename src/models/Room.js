const mongoose = require("mongoose")


const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
    hotel: { type: ObjectId, ref: "Hotel" },
	name: String,
	types: [Object],
    childrens: [Object],
})

module.exports = mongoose.model("Room", schema)