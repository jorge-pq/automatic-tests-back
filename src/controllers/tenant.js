const Auth = require('../middleware/auth.middleware');
const Tenant = require("../models/Tenant")
const {RETAIL, WHOLESALER} = require("../contants");
const { path } = require("../config");
const {register, validateFields} = require('../service/auth.service');

module.exports = function (app) {

    app.post(path('tenant/create'), Auth, async (req, res) => {
        try {
            let data = req.body;
            const tenant = data.tenant ? await Tenant.findOne({ _id: data.tenant }) : '';
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
            if(tenant.type === WHOLESALER){
                if(validateFields(data.fullname, data.phone, data.password)){
                data.type = RETAIL;
                data.tenant = tenant._id;
                const newTenant = new Tenant(data)
                await newTenant.save();  
                await register({
                    fullname: data.fullname,
                    username: data.phone,
                    phone: data.phone,
                    password: data.password,
                    role: "administrator",
                    tenant: newTenant._id
                })
                Tenant.updateOne({'_id': tenant._id}, {'$push':  {brokers: newTenant}})
                res.status(200).json(newTenant);
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