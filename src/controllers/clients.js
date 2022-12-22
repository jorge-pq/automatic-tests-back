const Auth = require('../middleware/auth.middleware');
const Client = require("../models/Client");
const Tenant = require("../models/Tenant");
const {path} = require("../config");
const {saveClient} = require('../service/client.service');


module.exports = function(app){

app.get(path("clients"), Auth, async (req, res) => {
	let data = req.body;
	let clients = await Client.find({ tenant: data.tenant });
	res.send(clients);
})

app.post(path("clients/create"), Auth, async (req, res) => {
	let data = req.body;
	const tenant = await Tenant.findOne({ _id: data.tenant });
	await saveClient(data, tenant);
	res.send({message: 'Client added succesfully!'});
})

}