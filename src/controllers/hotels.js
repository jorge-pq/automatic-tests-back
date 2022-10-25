const Auth = require('../middleware/auth.middleware');
const Tenant = require("../models/Tenant")
const Hotel = require("../models/Hotel")
const upload = require("../middleware/upload");
const {path} = require("../config");

module.exports = function(app){

// Welcome
app.get(path(), async (req, res) => {
	res.send("Welcome!!")
})


// ------------ Hotels controller -------------

app.get(path("hotels"), Auth, async (req, res) => {
	let data = req.body;
	const hotels = await Hotel.find({ tenant: data.tenant })
	res.send(hotels)
})

app.post(path("hotels/create"), Auth, async (req, res) => {
	let data = req.body;
	const tenant = await Tenant.findOne({ _id: data.tenant });
	const hotel = new Hotel(req.body);
	hotel.tenant = tenant;
	await hotel.save();
	await Tenant.updateOne({_id: tenant._id}, {'$push':  {hotels: newTenant}})
	res.send(hotel);
})


app.get(path("hotel/:id"), Auth, async (req, res) => {
	const hotel = await Hotel.findOne({ _id: req.params.id });
	res.send(hotel)
})

app.put(path("hotel/:id"), Auth, async (req, res) => {
	try {
		const hotel = await Hotel.findOne({ _id: req.params.id })

		if (req.body.name) {
			hotel.name = req.body.name;
			hotel.slug = req.body.slug;
		}

		await hotel.save()
		res.send(hotel)
	} catch {
		res.status(404)
		res.send({ error: "Hotel doesn't exist!" })
	}
})

app.delete(path("hotel/:id"), Auth, async (req, res) => {
	try {
		await Hotel.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Hotel doesn't exist!" })
	}
})

app.get(path("hotel/slug/:slug"), Auth, async (req, res) => {
	const hotel = await Hotel.findOne({ slug: req.params.slug });
	res.send(hotel)
})


// --------------------- Room Controller -----------------------------


app.put(path("room/add/:id"), Auth, async (req, res) => {
	try {
		const hotel = await Hotel.findOne({ _id: req.params.id })

		hotel.rooms.push({
			name: req.body.name,
			types:req.body.types,
			childrens: req.body.childrens
		})

		await hotel.save()
		res.send(hotel)
	} catch {
		res.status(404)
		res.send({ error: "Hotel doesn't exist!" })
	}
})

app.put(path("room/update/:id"), Auth, async (req, res) => {
	try {
		const hotel = await Hotel.findOne({ _id: req.params.id })

		const pos = hotel.rooms.findIndex(d=>d.name===req.body.roomOld);
		hotel.rooms[pos] = {
			name: req.body.name,
			types:req.body.types,
			childrens: req.body.childrens
		};

		await hotel.save()
		res.send(hotel)
	} catch {
		res.status(404)
		res.send({ error: "Hotel doesn't exist!" })
	}
})

app.put(path("room/remove"), Auth, async (req, res) => {
	try {
		const hotel = await Hotel.findOne({ _id: req.body.hotelId })
		const update = hotel.rooms.filter(d=>d.name!==req.body.roomName);
		hotel.rooms = update;

		await hotel.save()
		res.send(hotel)
	} catch {
		res.status(404)
		res.send({ error: "Hotel doesn't exist!" })
	}
})

//------------------------ Subir imagenes -----------------------------------

app.post(path("hotels/gallery"), Auth, async (req, res) => {
	try {
		await upload(req, res);
		if (req.files.length <= 0) {
			return res.send(`You must select at least 1 file.`);
		}
		const hotel = await Hotel.findOne({ _id: req.body.id });
		let imgs = [];
		let main = req.files.main ? req.files.main[0].originalname : null;
		if(main){
			hotel.cover = main;
		}
		let images = req.files.images ? req.files.images : [];
		for (let index = 0; index < images.length; index++) {
			imgs.push({path: images[index].originalname, active: true});
		}

		hotel.images = hotel.images.concat(imgs);
		await hotel.save();
		return res.send(`Files has been uploaded.`);
	} catch (error) {
		console.log(error);
		if (error.code === "LIMIT_UNEXPECTED_FILE") {
			return res.send("Too many files to upload.");
		}
		return res.send(`Error when trying upload many files: ${error}`);
	}
})

}