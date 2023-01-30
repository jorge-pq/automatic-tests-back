const {create, update} = require("../service/test.service");
const {path} = require("../config");

module.exports = function(app){

app.post(path("test/create/:appId"), async (req, res) => {
	let data = req.body;
	let appId = req.params.appId;
	try {
		await create(appId, data);
		res.send({ message: "Created!" })
	} catch (error) {
		res.status(404)
		res.send({ error: "Error!" })
	}
	res.send(result);
})


app.put(path("test/update/:id"), async (req, res) => {
	let data = req.body;
	let id = req.params.id
	try {
		await update(id, data);
		res.send({ message: "Updated!" });
	} catch {
		res.status(404)
		res.send({ error: "Hotel doesn't exist!" })
	}
})


}