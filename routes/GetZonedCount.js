const ZonedSchema = require('../models/ZonedData');

module.exports = (app) => {
	app.get('/getZonedCount', (req, res) => {

		ZonedSchema.find({ flag: false }, async (err, data) => {
			if(err) throw err;
			return res.send({ count: data.length });
		})
	})
}