const Auth = require('../middleware/auth.middleware');
const RoomType = require("../models/RoomType");
const Tenant = require("../models/Tenant");
const {path} = require("../config");

module.exports = function (app) {

	app.get(path("roomtypes"), Auth, async (req, res) => {
		let data = req.body;
		const types = await RoomType.find({
			tenant: data.tenant
		});
		res.send(types)
	})

	app.post(path("roomtypes/create"), Auth, async (req, res) => {
		let data = req.body;
		const tenant = await Tenant.findOne({
			_id: data.tenant
		});
		const type = new RoomType(req.body);
		type.tenant = tenant._id;
		await type.save();
		res.send(type);
	})

	app.put(path("roomtypes/:id"), Auth, async (req, res) => {
		try {
			const type = await RoomType.findOne({
				_id: req.params.id
			})

			if (req.body.name) {
				type.name = req.body.name;
				type.description = req.body.description;
				type.persons = req.body.persons;
			}

			await type.save()
			res.send(type)
		} catch {
			res.status(404)
			res.send({
				error: "Room type doesn't exist!"
			})
		}
	})

	app.delete(path("roomtypes/:id"), Auth, async (req, res) => {
		try {
			await RoomType.deleteOne({
				_id: req.params.id
			});
			res.status(204).send()
		} catch {
			res.status(404)
			res.send({
				error: "Room type doesn't exist!"
			})
		}
	})

}