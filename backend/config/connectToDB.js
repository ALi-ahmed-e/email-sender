const mongoose = require('mongoose');

const connectToDB = () => {

	mongoose.connect(process.env.DB_URI)
	mongoose.connection.on("connected", () => {
		return console.log("Connected to database sucessfully");
	});

	mongoose.connection.on("error", (err) => {
		return console.log("Error while connecting to database :" + err);
	});

	mongoose.connection.on("disconnected", () => {
		return console.log("Mongodb connection disconnected");
	});
}

module.exports = connectToDB
