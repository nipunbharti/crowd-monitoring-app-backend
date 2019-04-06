const ZonedSchema = require('../models/ZonedData');
const Parallel = require('async-parallel');
const config = require('../config/dev');

module.exports = (app) => {
	app.get('/setTrueZone', (req, res) => {
		ZonedSchema.find({flag: false, imageName: { $regex: config.feedName }}, async (err, data) => {
			console.log(data);
			data.forEach(val => {
				val.flag = true;
				val.save();
			})
		})

		res.send({message: 'success'});
	})
}