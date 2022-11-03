const Auth = require('../middleware/auth.middleware');
const Booking = require("../models/Booking")
const Tenant = require("../models/Tenant")
const {path} = require("../config");
const mongoose = require("mongoose");
const {getCode} = require('../service/util');
const {PENDING, CANCELLED, CONFIRMED} = require('../contants');

module.exports = function(app){

app.get(path("booking"), Auth, async (req, res) => {
	let data = req.body;
	const tenant = await Tenant.findOne({ _id: data.tenant });
	result = await Booking.find({ tenant: tenant._id });
	
	res.send(result)
})

app.post(path("booking/create"), Auth, async (req, res) => {
	let data = req.body;
	const tenant = await Tenant.findOne({ _id: data.tenant });
	const booking = new Booking(req.body);
	booking.tenant = tenant;
	booking.code = await getCode(data.hotel.code);
	booking.state = PENDING;
	booking.creationDate = new Date();
	await booking.save();
	res.send(booking);
})

}