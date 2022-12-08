module.exports = function (app) {
	require("./controllers/hotels")(app);
	require("./controllers/user")(app);
	require("./controllers/tenant")(app);
	require("./controllers/booking")(app);
	require("./controllers/roomtypes")(app);
	require("./controllers/clients")(app);
	require("./controllers/tours")(app);
}