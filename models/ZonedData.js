const mongoose = require('mongoose');
const { Schema } = mongoose;

var zonedSchema = new Schema({
	imageName: String,
	flag: Boolean
}, {collection: 'zonedSchema'});

module.exports = mongoose.model('zonedSchema', zonedSchema);