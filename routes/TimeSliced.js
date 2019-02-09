module.exports = (app, AWS) => {
	let bucketParams = {
		Bucket: 'cromdev'
	};

	app.post('/timeSlicedImages', (req, res) => {
		let { body } = req;
		let { time1, time2 } = body;

		s3 = new AWS.S3({apiVersion: '2019-02-09'});
		s3.listObjects(bucketParams, function(err, data) {
		  if (err) {
		    console.log("Error", err);
		  } else {
		  	return res.send(data);
		    // console.log("Success", data);
		  }
		});
	})	
}