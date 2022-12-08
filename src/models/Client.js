const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;


const schema = mongoose.Schema({
	name: { type : String, required: true },
    secondname: String,
    lastname: { type : String, required: true },
    secondlastname: String,
    phone: { type : String, required: true },
    email: { type : String, required: true },
    birthday: { type: String, default: true },
	clientID: { type: String, default: true },
    state:{ type: String, default: true },
    city:{ type: String, default: true },
    address:{ type: String, default: true },
    zipcode: { type: String, default: true },
    tenant: { type: ObjectId, ref: "Tenant", required: false },
})

module.exports = mongoose.model("Client", schema)