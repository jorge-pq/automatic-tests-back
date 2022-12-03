const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const {RETAIL, WHOLESALER} = require('../contants');

const schema = mongoose.Schema({
	name: { type : String, required: true, validate: { 
        validator: async function(name) {
            const tenant = await this.constructor.findOne({ name });
            if(tenant) {
              if(this._id === tenant._id) {
                return true;
              }
              return false;
            }
            return true;
          },
          message: () => 'The tenant already exists.'
     }
    },
	type: RETAIL | WHOLESALER,
  address: String,  
  state: String,
  city: String,
  zipCode: String,
  phoneAgency: String,  
	tenant: { type: ObjectId, ref: "Tenant", required: false },
	brokers: [{ type: ObjectId, ref: "Tenant"}],
  hotels: [{ type: ObjectId, ref: "Hotel"}],
  tours: [{ type: ObjectId, ref: "Tour"}]
})


module.exports = mongoose.model("Tenant", schema)