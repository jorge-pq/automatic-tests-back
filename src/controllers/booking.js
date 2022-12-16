const Auth = require('../middleware/auth.middleware');
const Booking = require("../models/Booking")
const User = require("../models/User")
const Tenant = require("../models/Tenant")
const {path} = require("../config");
const {getCode} = require('../service/util');
const {PENDING, CONFIRMED} = require('../contants');
const {saveClient} = require('../service/client.service');

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
	const user = await User.findOne({ username: data.username, tenant: data.tenant })
	const booking = new Booking(req.body);
	booking.tenant = tenant;
	booking.code = await getCode(data.hotel.code);
	booking.state = parseFloat(data.pay.balance) > 0 ? PENDING : CONFIRMED;
	booking.creationDate = new Date();
	booking.agencyInfo = {
		state: tenant.state,
		city: tenant.city,
		zipCode: tenant.zipCode,
		phoneAgency: tenant.phoneAgency, 
		address: tenant.address,
	}
	booking.employee = user.fullname;
	await booking.save();
	await saveClient(booking.client, tenant);
	res.send(booking);
})

app.get(path("booking/:id"), Auth, async (req, res) => {
	const booking = await Booking.findOne({ _id: req.params.id });
	res.send(booking)
})

app.put(path("booking/update/:id"), Auth, async (req, res) => {
	try {
		let filter = { _id: req.params.id };
		let values = req.body;
		let booking = await Booking.findOneAndUpdate(filter, values)
		res.send(booking)
	} catch {
		res.status(404)
		res.send({ error: "Booking doesn't exist!" })
	}
})

app.get(path("booking/availability/:period"), Auth, async (req, res) => {
	const bookings = await Booking.find({type: 'tour', state : { $in : [PENDING, CONFIRMED]}});
	
	let i = 0;
	let flag = false;
	let total = 0;
	while (i<bookings.length && !flag) {
		let p = bookings[i].order[0].period;
		let parse = String(p).replace(/\//g, ".").replace(/ /g,"");
		if(parse === req.params.period){
			total++;
		}
		i++;
	}
	res.send({total: total})
})


}