module.exports = function (app) {
	require("./controllers/application.controller")(app);
	require("./controllers/test.controller")(app);
}