const User = require("../models/User");
const Tenant = require("../models/Tenant")
const {Sign} = require("../service/jwtAuth");
const { path } = require("../config");
const {register} = require('../service/auth.service');
const Auth = require('../middleware/auth.middleware');

module.exports = function (app) {

	app.post(path('auth/login'), async (req, res) => {
		const {username, password} = req.body;

		try {
			const user = await User.findOne({
				username: username
			});
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
			const tenant = await Tenant.findOne({
				name: req.tenant
			});
			let req = req.body;
			data.tenant = tenant._id;
			let user = await register(req.body)
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json({
				error: error,
			});
		}
	})


}