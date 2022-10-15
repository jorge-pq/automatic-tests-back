const Auth = require('../middleware/auth.middleware');
const Tenant = require("../models/Tenant")
const {RETAIL, WHOLESALER} = require("../contants");
const { path } = require("../config");

module.exports = function (app) {

    app.post(path('tenant/create'), Auth, async (req, res) => {
        try {
            let data = req.body;
            if(data.role === "super_admin"){
                data.type = WHOLESALER;
                const tenant = new Tenant(data)
                await tenant.save();  
                res.status(200).json(tenant);
                return;
            }
            if(data.tenant === WHOLESALER){
                const wholesaler = await Tenant.findOne({ name: data.tenant });
                data.type = RETAIL;
                data.tenant = wholesaler._id;
                const tenant = new Tenant(data)
                await tenant.save();  
 
                Tenant.updateOne({'_id': wholesaler._id}, {'$push':  {brokers: tenant}})
                res.status(200).json(tenant);
                return;
            }
            else{
                res.status(400).json({error: "Unauthorized"});
            }
            
        } catch (error) {
            res.status(400).json(error);
        }  
    })

}