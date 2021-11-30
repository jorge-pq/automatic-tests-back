const express = require("express")
const Hotel = require("./models/Hotel") 
const router = express.Router()

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

module.exports = router