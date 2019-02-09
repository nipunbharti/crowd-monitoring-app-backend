const moment = require('moment');

async function getObject(key) {
	let params = {
		Bucket: 'cromdev',
		Key: key
	};
	let comp = await s3.getObject(params).promise();
	comp["name"] = key;
	return comp;
}

module.exports = (app, AWS) => {
	let bucketParams = {
		Bucket: 'cromdev'
	};

	app.get('/timeSlicedImages', (req, res) => {
		// let { body } = req;
		// let { time1, time2 } = body;

		AWS.config.update({region: 'us-east-1'});
		s3 = new AWS.S3({apiVersion: '2019-02-09'});
		s3.listObjects(bucketParams,async function(err, data) {
		  if (err) {
		    console.log("Error", err);
		  } else {
		  	var i=0;
		  	// To be done
			// let date1 = moment(time1, 'DDMMYYYYHHmm').format('DDMMYYYYHHmm');
			// let date2 = moment(time2, 'DDMMYYYYHHmm').format('DDMMYYYYHHmm');
			// console.log(date1, date2);
			// let prunedData = data.Contents.map(data => data.Key.slice()); 
			let namedData = data.Contents.map(data => data.Key);
			let returnedData = [];
			for(let i=0;i<namedData.length;i++) {
				let res = await getObject(namedData[i]);
				returnedData.push(res);
			}
			console.log(returnedData);
			return res.send(returnedData);
		  }
		});
	})	
}