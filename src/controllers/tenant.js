const Auth = require('../middleware/auth.middleware');
const Tenant = require("../models/Tenant")
const {RETAIL, WHOLESALER} = require("../contants");
const { path } = require("../config");
const {register, validateFields} = require('../service/auth.service');

module.exports = function (app) {

    app.post(path('tenant/create'), Auth, async (req, res) => {
        try {
            let data = req.body;
            if(data.role === "super_admin"){
                if(validateFields(data.fullname, data.phone, data.password)){
                    data.type = WHOLESALER;
                    const tenant = new Tenant(data)
                    await tenant.save();  
                    await register({
                        fullname: data.fullname,
                        username: data.phone,
                        phone: data.phone,
                        password: data.password,
                        role: "administrator",
                        tenant: tenant._id
                    })
                    res.status(200).json(tenant);
                    return;
                }
                else{
                    res.status(400).json({error: "fields missing"});
                    return;  
                }
               
            }
            if(data.tenant === WHOLESALER){
                if(validateFields(data.fullname, data.phone, data.password)){
                const wholesaler = await Tenant.findOne({ name: data.tenant });
                data.type = RETAIL;
                data.tenant = wholesaler._id;
                const tenant = new Tenant(data)
                await tenant.save();  
                await register({
                    fullname: data.fullname,
                    username: data.phone,
                    phone: data.phone,
                    password: data.password,
                    role: "administrator",
                    tenant: tenant._id
                })
                Tenant.updateOne({'_id': wholesaler._id}, {'$push':  {brokers: tenant}})
                res.status(200).json(tenant);
                return;   
                }
                else{
                    res.status(400).json({error: "fields missing"});
                    return;  
                }
            }
            else{
                res.status(400).json({error: "Unauthorized"});
            }
            
        } catch (error) {
            res.status(400).json(error);
        }  
    })



}