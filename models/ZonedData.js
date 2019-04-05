const mongoose = require('mongoose');
const { Schema } = mongoose;

var zonedSchema = new Schema({
	imageName: String,
	flag: {
		type: Boolean,
		default: false
	}
});
module.exports = mongoose.model('zonedSchema', zonedSchema);