const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
	fullname: String,
    email: String,
    username: String,
    phone: String,
    password: String,
    role: String,
    active: { type: Boolean, default: true },
	tenant: { type: ObjectId, ref: "Tenant", required: false }
})

module.exports = mongoose.model("User", schema)