const moment = require('moment');
var FileReader = require('filereader');
const Parallel = require('async-parallel');

async function getObject(key) {
	let params = {
		Bucket: 'pdpdev',
		Key: key
	};
	let comp = await s3.getObject(params).promise();
	let base64 = await bTB64(comp.Body);
	comp["Body"] = base64;
	comp["name"] = key;
	return comp;
}

bTB64 = async (blob) => {
	var base64Image = await new Buffer( blob, 'binary' ).toString('base64');
	return base64Image;
}

module.exports = (app, AWS) => {
	let bucketParams = {
		Bucket: 'pdpdev'
	};

	app.post('/timeSlicedImages', (req, res) => {
		let { body } = req;
		let { time1, time2 } = body;

		AWS.config.update({region: 'us-east-1'});
		s3 = new AWS.S3({apiVersion: '2019-02-09'});
		s3.listObjects(bucketParams, async function(err, data) {
		  if (err) {
		    console.log("Error", err);
		  } else {
			let date1 = moment(time1, 'DDMMYYYYHHmm').format('DDMMYYYYHHmm');
			let date2 = moment(time2, 'DDMMYYYYHHmm').format('DDMMYYYYHHmm');
			let newData = data.Contents.map(data => moment(data.LastModified, 'DDMMYYYYHHmm').utcOffset('+0530').format('DDMMYYYYHHmm'));
			let prunedData1 = newData.filter(data => data>=date1 && data<=date2);
			let prunedData2 = data.Contents.filter(x => prunedData1.includes(moment(x.LastModified, 'DDMMYYYYHHmm').utcOffset('+0530').format('DDMMYYYYHHmm')))
			let namedData = prunedData2.map(data => data.Key);
			let returnedData = [];
			let res1 = await (async function() {
				await Parallel.each(namedData, async value => {
					let res = await getObject(value);
					returnedData.push(res);
				})
			})();
			return res.send(returnedData);
		  }
		});
	})	
}