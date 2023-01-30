const {create, update, getAll, getById} = require("../service/test.service");
const {path} = require("../config");

module.exports = function(app){


app.get(path("tests"), async (req, res) => {
	try {
       let result = await getAll();
       res.send(result)
    } catch (error) {
        res.status(404)
		res.send({ error: "Error!" })
    }
	
})

app.get(path("test/:id"), async (req, res) => {
	try {
       let result = await getById(req.params.id);
       res.send(result)
    } catch (error) {
        res.status(404)
		res.send({ error: "Error!" })
    }
	
})


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