const Auth = require('../middleware/auth.middleware');
const Tenant = require("../models/Tenant");
const Booking = require("../models/Booking");
const {RETAIL, WHOLESALER} = require("../contants");
const { path } = require("../config");
const {register, validateFields} = require('../service/auth.service');
const {CONFIRMED} = require('../contants');
const {getDateRange} = require('../service/util');

const COUNT_PER_PAGE_BY_REPORT = 10;


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
                const t = await Tenant.updateOne({_id: tenant._id}, {'$push':  {brokers: newTenant}})
                res.status(200).json(newTenant);
                return;   
                }
                else{
                    res.status(400).json({error: "fields missing"});
                    return;  
                }
            }
            else{
                res.status(403).json({error: "Unauthorized"});
            }
            
        } catch (error) {
            res.status(400).json(error);
        }  
    })

    app.get(path('tenant/brokers'), Auth, async (req, res) => {
        try {
            let data = req.body;
            const tenant = data.tenant ? await Tenant.findOne({ _id: data.tenant }) : '';
            if(data.role === "super_admin"){
                const tenants = await Tenant.find({ type: WHOLESALER }).populate('brokers');
                res.status(200).json(tenants);
                return;  
            }
            if(tenant.type === WHOLESALER){
                const tenants = await Tenant.find({ tenant: tenant._id, type: RETAIL });
                res.status(200).json(tenants);
                return;  
            }
            else{
                res.status(403).json({error: "Unauthorized"});
            }
        } catch (error) {
            res.status(400).json(error);
        }  
    })

    //---------------------------------------- Report -----------------------------------------

app.get(path("tenant/report/sales"), Auth, async (req, res) => {
	let data = req.body;
	let page = req.query.page;
	let date = req.query.date;
	const tenant = await Tenant.findOne({ _id: data.tenant }).populate('brokers');
	let agencies = tenant.brokers;
    agencies.push(tenant);

	let total_items = parseInt(agencies.length);
	let agencies_paginated = agencies.slice((parseInt(page)-1) * COUNT_PER_PAGE_BY_REPORT, parseInt(page) * COUNT_PER_PAGE_BY_REPORT);

	let report = [];
	let range = getDateRange(date);

	for (const item of agencies_paginated) {
        const bookings = await Booking.find({
			state : CONFIRMED, 
			'agencyInfo.name': item.name,
			creationDate: {
				$gte: range.from, 
				$lt: range.to
			}
		});

        report.push({
			name: item.name,
			total: bookings.reduce((a, c) => (a+parseFloat(c.pay.total)),0)
		});
    }
	

	res.send({data: report, pages: Math.ceil(total_items/COUNT_PER_PAGE_BY_REPORT)})
	
})

}