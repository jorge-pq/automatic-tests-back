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
	let myOrders = await Booking.find({ tenant: tenant._id }).populate('tenant', '_id name type');
	let brokersIds = tenant.brokers.map(i => i._id);
	let myRetailsOrders = await Booking.find().where('tenant').in(brokersIds).populate('tenant', '_id name type');
	let result = myOrders.concat(myRetailsOrders);
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

app.get(path("booking/:id"), Auth, async (req, res) => {
	const booking = await Booking.findOne({ _id: req.params.id });
	res.send(booking)
})


}