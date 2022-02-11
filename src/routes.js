const express = require("express")
const Hotel = require("./models/Hotel")
const router = express.Router()
const upload = require("./middleware/upload");


// Welcome
router.get("/", async (req, res) => {
	res.send("Welcome!!")
})


// ------------ Hotels controller -------------

router.get("/hotels", async (req, res) => {
	const hotels = await Hotel.find()
	res.send(hotels)
})

router.post("/hotels/create", async (req, res) => {
	const hotel = new Hotel(req.body)
	await hotel.save()
	res.send(hotel)
})


router.get("/hotel/:id", async (req, res) => {
	const hotel = await Hotel.findOne({ _id: req.params.id });
	res.send(hotel)
})

router.put("/hotel/:id", async (req, res) => {
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

router.delete("/hotel/:id", async (req, res) => {
	try {
		await Hotel.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Hotel doesn't exist!" })
	}
})

router.get("/hotel/slug/:slug", async (req, res) => {
	const hotel = await Hotel.findOne({ slug: req.params.slug });
	res.send(hotel)
})


// --------------------- Room Controller -----------------------------


router.put("/room/add/:id", async (req, res) => {
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

router.put("/room/update/:id", async (req, res) => {
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

router.put("/room/remove", async (req, res) => {
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

router.post("/hotels/gallery", async (req, res) => {
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

module.exports = router