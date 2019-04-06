const ZonedSchema = require('../models/ZonedData');
const config = require('../config/dev');

module.exports = (app) => {
	app.get('/getZonedCount', (req, res) => {

		ZonedSchema.find({ flag: false, imageName: { $regex: config.feedName }}, async (err, data) => {
			if(err) throw err;
			return res.send({ count: data.length });
		})
	})
}