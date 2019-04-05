const ZonedSchema = require('../models/ZonedData');
const Parallel = require('async-parallel');

module.exports = (app) => {
	app.get('/setTrueZone', (req, res) => {
		ZonedSchema.find({flag: false}, async (err, data) => {
			console.log(data);
			data.forEach(val => {
				val.flag = true;
				val.save();
			})
		})

		res.send({message: 'success'});
	})
}