const mongoose = require("mongoose");

const schema = mongoose.Schema({
	name: String,
	number: Number,
});

module.exports = mongoose.model("TestData", schema);