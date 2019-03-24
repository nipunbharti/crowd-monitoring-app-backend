module.exports = (app, AWS) => {
	let bucketParams = {
		Bucket: 'cromdev'
	};

	app.get('/testApi', (req, res) => {
		console.log('Hit')
		AWS.config.update({region: 'us-east-1'});
		s3 = new AWS.S3({apiVersion: '2019-02-09'});

		s3.getBucketAccelerateConfiguration(bucketParams, function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else     console.log(data);           // successful response
		});
	})
}