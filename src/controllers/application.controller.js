const {path} = require("../config");
const {getAll, create} = require("../service/application.service");

module.exports = function(app){


app.get(path("apps"), async (req, res) => {
	try {
       let result = await getAll();
       res.send(result)
    } catch (error) {
        res.status(404)
		res.send({ error: "Error!" })
    }
	
})

app.post(path("apps"), async (req, res) => {
	let data = req.body;
	try {
		await create(data);
		res.send({ message: "Created!" })
	} catch (error) {
		res.status(404)
		res.send({ error: "Error!" })
	}
})

}