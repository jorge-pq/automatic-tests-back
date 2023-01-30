const {path} = require("../config");
const {getAll} = require("../service/application.service");

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


}