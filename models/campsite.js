var mongoose = require("mongoose");

var campsiteSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});
module.exports = mongoose.model("Campsite", campsiteSchema); 

