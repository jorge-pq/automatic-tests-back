const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;


const schema = mongoose.Schema({
	name: { type : String, required: true },
    secondname: String,
    lastname: { type : String, required: true },
    secondlastname: String,
    phone: { type : String, required: true },
    email: { type : String, required: false },
    birthday: { type: String, default: false },
	clientID: { type: String, default: false },
    state:{ type: String, default: false },
    city:{ type: String, default: false },
    address:{ type: String, default: false },
    zipcode: { type: String, default: false },
    tenant: { type: ObjectId, ref: "Tenant", required: false },
})

module.exports = mongoose.model("Client", schema)