const Client = require("../models/Client");

const add = async (client, tenant) => {
    const isExist = await Client.findOne({ clientID: client.clientID, tenant: tenant });
    if(!isExist){
        const c = new Client(client);
        c.tenant = tenant;
        await c.save();
    }
    else{
		isExist.email = client.email;
		isExist. birthday = client.birthday;
		isExist.clientID =  client.clientID;
		isExist.state = client.state;
		isExist.city = client.city;
		isExist.address = client.address;
		isExist.zipcode = client.zipcode;

		await isExist.save()
    }
}

module.exports = {
    saveClient: add
}