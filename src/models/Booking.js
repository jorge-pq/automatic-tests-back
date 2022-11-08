const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
	code: String,
	creationDate: Date,
	guests: [Object],
	client: Object,
    hotel: Object,
    order: [Object],
	state: String,
	tenant: { type: ObjectId, ref: "Tenant", required: false },
})

module.exports = mongoose.model("Booking", schema)