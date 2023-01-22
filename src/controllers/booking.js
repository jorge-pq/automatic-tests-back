const Auth = require('../middleware/auth.middleware');
const Booking = require("../models/Booking");
const Tour = require("../models/Tour")
const User = require("../models/User")
const Tenant = require("../models/Tenant")
const {path} = require("../config");
const {getCode, format} = require('../service/util');
const {PENDING, CONFIRMED} = require('../contants');
const {saveClient} = require('../service/client.service');

const COUNT_PER_PAGE = 50;


module.exports = function(app){

app.get(path("booking"), Auth, async (req, res) => {
	let data = req.body;
	let page = req.query.page;
	const tenant = await Tenant.findOne({ _id: data.tenant });
	let myOrders = await Booking.find({ tenant: tenant._id }).populate('tenant', '_id name type');
	let brokersIds = tenant.brokers.map(i => i._id);
	let myRetailsOrders = await Booking.find().where('tenant').in(brokersIds).populate('tenant', '_id name type');
	let result = myOrders.concat(myRetailsOrders);
	let orderByDate = result.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
	let total_items = parseInt(orderByDate.length);
	let paginated = orderByDate.slice((parseInt(page)-1) * COUNT_PER_PAGE, parseInt(page) * COUNT_PER_PAGE)
	res.send({data: paginated, pages: Math.ceil(total_items/COUNT_PER_PAGE)})
})

app.get(path("booking/count"), Auth, async (req, res) => {
	let data = req.body;
	const tenant = await Tenant.findOne({ _id: data.tenant });
	let countWholesaler = await Booking.countDocuments({ tenant: tenant._id });
	let brokersIds = tenant.brokers.map(i => i._id);
	let myRetailsOrders = await Booking.find().where('tenant').in(brokersIds);
	let result = countWholesaler + myRetailsOrders.length;
	res.send({total: result});
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
		name: tenant.name
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

app.get(path("booking/availability/:period/:tourId"), Auth, async (req, res) => {
	const bookings = await Booking.find({type: 'tour', state : { $in : [PENDING, CONFIRMED]}});
	
	let i = 0;
	let flag = false;
	let total = 0;
	while (i<bookings.length && !flag) {
		let p = bookings[i].order[0].period;
		let parse = String(p).replace(/\//g, ".").replace(/ /g,"");
		if(parse === req.params.period && bookings[i].hotel._id === req.params.tourId){
			let value = bookings[i].order.reduce((a, c) => (a + c.adults + c.childrensCount + (c.infantCount || 0)), 0);
			total+=value;
		}
		i++;
	}
	res.send({total: total})
})


app.get(path("booking/availabilities/:tourId"), Auth, async (req, res) => {
	const bookings = await Booking.find({type: 'tour', state : { $in : [PENDING, CONFIRMED]}}).populate('tenant', '_id name type');;
	const tour = await Tour.findOne({ _id: req.params.tourId });
	let offers = tour.details;
	let list = [];
	offers.forEach(item => {

		let date = `${item.isPeriod ? (format(new Date(item.period[0])) + ' - ' + format(new Date(item.period[1]))) : format(new Date(item.date))}`;
		let parse2 = String(date).replace(/\//g, ".").replace(/ /g,"");

		let obj = {
			period: parse2, 
			avalaibility: item.availability, 
			persons: 0
		}

		let p = bookings.filter(d=>String(d.order[0].period).replace(/\//g, ".").replace(/ /g,"")===parse2 && d.hotel._id === tour._id.toString())
		let persons = p.reduce((a, c) => (a + c.order[0].adults + c.order[0].childrensCount + (c.order[0].infantCount || 0)), 0);
		obj.persons = persons;
		let guests = [];
		p.map(item => guests.push({agency: item.tenant.name, persons: item.guests}))
		obj.guests = guests;
		list.push(obj);
	});

	res.send({data: list})
})




}