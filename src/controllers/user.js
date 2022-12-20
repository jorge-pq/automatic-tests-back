const User = require("../models/User");
const Tenant = require("../models/Tenant")
const {Sign} = require("../service/jwtAuth");
const { path } = require("../config");
const {register, validateFields, validateUser} = require('../service/auth.service');
const Auth = require('../middleware/auth.middleware');

module.exports = function (app) {

	app.post(path('auth/login'), async (req, res) => {
		const {username, password} = req.body;

		try {
			const user = await User.findOne({
				username: username
			}).populate('tenant');
			if (!user) {
				res.status(401).json({
					error: "Username not exist",
				});
			} else {
				if (user.active) {
					let check = bcrypt.compareSync(password, user.password);
					if (check) {
						const { fullname, username, role } = user;
						const tenant = user.tenant;
						let token = Sign({username, role, tenant});
						res.status(200).json({
							token: token,
							user: {
								username: username,
								role: role,
								tenant: tenant,
								fullname: fullname
							}
						});
					} else {
						res.status(401).json({
							error: "Password incorrect",
						});
					}
				} else {
					res.status(401).json({
						error: "User inactive",
					});
				}
			}
		} catch (error) {
			res.status(500).json({
				error: error,
			});
		}
	})

	app.post(path('add/user'), Auth, async (req, res) => {
		try {
			let data = req.body;
			if(validateFields(data.fullname, data.phone, data.password)){
				let isExist = await validateUser(data.phone, data.tenant);
				if(!isExist){
					let user = await register({
						fullname: data.fullname,
						username: data.phone,
						phone: data.phone,
						password: data.password,
						role: data.userRole || "administrator",
						tenant: data.tenant
					})
					res.status(200).json(user);
				}
				else{
					res.status(400).json({error: "User already exists!"});
				}
			}
			else{
				res.status(400).json({error: "fields missing"});
			}
			
		} catch (error) {
			res.status(500).json({
				error: error,
			});
		}
	})

	app.post(path('users/:tenant'), Auth, async (req, res) => {
		let users = await User.find({ tenant: req.params.tenant });
		res.send(users);
	})


}