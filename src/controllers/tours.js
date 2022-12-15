const Auth = require('../middleware/auth.middleware');
const Tenant = require("../models/Tenant")
const Tour = require("../models/Tour");
const {path} = require("../config");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = function(app){


app.get(path("tours"), Auth, async (req, res) => {
	let data = req.body;
	const tenant = await Tenant.findOne({ _id: data.tenant });
	let result;
	if(tenant.type === "Wholesaler"){
		result = await Tenant.findOne({ _id: tenant._id }).populate('tours');
	}
	else{
		result = await Tenant.findOne({ _id: tenant.tenant }).populate('tours');
	}
	
	res.send(result.tours)
})

app.get(path("tours/active"), Auth, async (req, res) => {
	let data = req.body;
	const tenant = await Tenant.findOne({ _id: data.tenant });
	let result;
	if(tenant.type === "Wholesaler"){
		result = await Tenant.findOne({ _id: tenant._id }).populate('tours');
	}
	else{
		result = await Tenant.findOne({ _id: tenant.tenant }).populate('tours');
	}
	
	res.send(result.tours.filter(d=>d.active===true))
})

app.post(path("tours/create"), Auth, async (req, res) => {
	let data = req.body;
	const tenant = await Tenant.findOne({ _id: data.tenant });
	const tour = new Tour(req.body);
	tour.tenant = tenant;
	await tour.save();
	await Tenant.updateOne({_id: tenant._id}, {'$push':  {tours: tour}})
	res.send(tour);
})


app.get(path("tours/:id"), Auth, async (req, res) => {
	const tour = await Tour.findOne({ _id: req.params.id });
	res.send(tour)
})

app.put(path("tours/:id"), Auth, async (req, res) => {
	try {
		const tour = await Tour.findOne({ _id: req.params.id })

		if (req.body.name) {
			tour.code = req.body.code;
			tour.name = req.body.name;
			tour.category = req.body.category;
			tour.slug = req.body.slug;
			tour.country = req.body.country,
			tour.state = req.body.state,
			tour.city = req.body.city,
			tour.zipCode = req.body.zipCode,
			tour.address = req.body.address,
			tour.active = req.body.active
		}

		await tour.save()
		res.send(tour)
	} catch {
		res.status(404)
		res.send({ error: "Tour doesn't exist!" })
	}
})

app.delete(path("tours/:id"), Auth, async (req, res) => {
	try {
		let data = req.body;
		await Tour.deleteOne({ _id: req.params.id });
		const tenant = await Tenant.findOne({ _id: data.tenant });
		await Tenant.updateOne({_id: tenant._id}, {'$pull':  {tours: req.params.id}})
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Tour doesn't exist!" })
	}
})

app.get(path("tours/slug/:slug"), Auth, async (req, res) => {
	let data = req.body;
	const tour = await Tour.findOne({ slug: req.params.slug, tenant: data.tenant});
	res.send(tour)
})


app.put(path("tour/details/add/:id"), Auth, async (req, res) => {
	try {
		const tour = await Tour.findOne({ _id: req.params.id })
		tour.details = req.body.types;
		await tour.save()
		res.send(tour)
	} catch {
		res.status(404)
		res.send({ error: "Tour doesn't exist!" })
	}
})



}