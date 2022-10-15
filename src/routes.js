module.exports = function (app) {
	require("./controllers/hotels")(app);
	require("./controllers/user")(app);
}