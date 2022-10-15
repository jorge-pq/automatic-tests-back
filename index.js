const express = require("express")
const mongoose = require("mongoose")
const {DB} = require("./src/config")
const routes = require("./src/routes") 
const cors = require("cors")
const path = require("path");
const {seed} = require('./src/service/seed');

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		const app = express()
		app.use('/public',express.static(path.join(__dirname, 'public/')));
		app.use(cors());
		app.use(express.json()) ;
		seed();
		routes(app);

		const PORT = process.env.PORT || 8080;
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}.`);
		});
	})
