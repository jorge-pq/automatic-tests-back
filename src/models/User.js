const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
	fullname: { type : String, required: true },
    email: String,
    username: { type : String, required: true },
    phone: { type : String, required: true },
    password: { type : String, required: true },
    role: { type : String, required: true },
    active: { type: Boolean, default: true },
	tenant: { type: ObjectId, ref: "Tenant", required: false }
})

module.exports = mongoose.model("User", schema)