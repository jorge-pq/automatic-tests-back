const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const {RETAIL, WHOLESALER} = require('../contants');

const schema = mongoose.Schema({
	name: String,
	type: RETAIL | WHOLESALER,
	tenant: { type: ObjectId, ref: "Tenant", required: false },
	brokers: [{ type: ObjectId, ref: "Tenant"}]
})

module.exports = mongoose.model("Tenant", schema)