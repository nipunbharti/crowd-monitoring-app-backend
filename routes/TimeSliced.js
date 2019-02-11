const moment = require('moment');
var FileReader = require('filereader')

async function getObject(key) {
	let params = {
		Bucket: 'cromdev',
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
		Bucket: 'cromdev'
	};

	app.post('/timeSlicedImages', (req, res) => {
		console.log('Hit')
		let { body } = req;
		let { time1, time2 } = body;

		AWS.config.update({region: 'us-east-1'});
		s3 = new AWS.S3({apiVersion: '2019-02-09'});
		s3.listObjects(bucketParams, async function(err, data) {
		  if (err) {
		    console.log("Error", err);
		  } else {
		  	// var i=0;
		 	// To be done
			let date1 = moment(time1, 'DDMMYYYYHHmm').format('DDMMYYYYHHmm');
			let date2 = moment(time2, 'DDMMYYYYHHmm').format('DDMMYYYYHHmm');
			console.log(date1, date2);
			let newData = data.Contents.map(data => moment(data.LastModified, 'DDMMYYYYHHmm').utcOffset('+0000').format('DDMMYYYYHHmm'));
			let prunedData = newData.map(data => moment(data).isBetween(date2, date1));
			console.log("New", prunedData);
			// let prunedData = data.Contents.map(data => data.Key.slice());
			// let namedData = data.Contents.map(data => data.Key);
			// let returnedData = [];
			// for(let i=0;i<namedData.length;i++) {
			// 	let res = await getObject(namedData[i]);
			// 	returnedData.push(res);
			// }
			// console.log(returnedData);
			return res.send(data);
		  }
		});
	})	
}