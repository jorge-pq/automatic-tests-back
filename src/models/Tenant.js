const mongoose = require("mongoose");
const {RETAIL, WHOLESALER} = require('../contants');

const schema = mongoose.Schema({
	name: String,
	type: [RETAIL, WHOLESALER]
})

module.exports = mongoose.model("Tenant", schema)