module.exports = (app, AWS) => {
	let bucketParams = {
		Bucket: 'cromdev'
	};

	app.get('/testApi', (req, res) => {
		console.log('Hit')
		AWS.config.update({region: 'us-east-1'});
		s3 = new AWS.S3({apiVersion: '2019-02-09'});
		s3.listObjects(bucketParams, async function(err, data) {
		  if (err) {
		    console.log("Error", err);
		  } else {
			return res.send(data);
		  }
		});
	})
}