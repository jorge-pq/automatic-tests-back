const express = require("express")
const mongoose = require("mongoose")
const {CONFIG} = require("./src/config")
const routes = require("./src/routes") 
const cors = require("cors")

const {DB_HOST, DB_PORT, DB_NAME, DB_PASSWORD} = CONFIG;

mongoose
	.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, { useNewUrlParser: true })
	.then(() => {
		const app = express()
		app.use(cors())
		app.use(express.json()) 
		app.use("/api", routes)

		app.listen(5000, () => {
			console.log("Server has started!")
		})
	})