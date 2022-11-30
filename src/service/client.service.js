const Client = require("../models/Client");

const add = async (client, tenant) => {
    const client = await Client.findOne({ clientID: client.clientID });
    if(!client){
        const c = new Client(client);
        c.tenant = tenant;
        await c.save();
    }
    // si existe editar phone and email y toda la direccion
}

module.exports = {
    saveClient: add
}