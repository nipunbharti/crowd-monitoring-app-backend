const ZonedSchema = require('../models/ZonedData');
const Parallel = require('async-parallel');
const config = require('../config/dev');

async function getObject(key) {
	try {
		let params = {
			Bucket: config.bucket,
			Key: key
		};
		let comp = await s3.getObject(params).promise();
		let base64 = await bTB64(comp.Body);
		comp["Body"] = base64;
		comp["name"] = key;
		return comp;
	}		
	catch(err) {
		return 'IMGNT';
	}
}

bTB64 = async (blob) => {
	var base64Image = await new Buffer( blob, 'binary' ).toString('base64');
	return base64Image;
}

module.exports = (app, AWS) => {
	app.get('/getZonedData', (req, res) => {

		AWS.config.update({region: 'us-east-1'});
		s3 = new AWS.S3({apiVersion: '2019-02-09'});

		ZonedSchema.find({ flag: false }, async (err, data) => {
			if(err) throw err;
			let returnedData = [];
			let res1 = await (async function() {
				await Parallel.each(data, async value => {
					let res2 = await getObject(value.imageName);
					if(res2 != 'IMGNT') {
						returnedData.push(res2);
					}
				})
			})();
			return res.send(returnedData);
		})
	})
}