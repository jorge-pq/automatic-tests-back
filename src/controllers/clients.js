const Auth = require('../middleware/auth.middleware');
const Client = require("../models/Client");
const {path} = require("../config");

module.exports = function(app){

app.get(path("clients"), Auth, async (req, res) => {
	let data = req.body;
	let clients = await Client.find({ tenant: data.tenant });
	res.send(clients);
})

}