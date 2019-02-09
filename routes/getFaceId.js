module.exports = (app, AWS) => {
	let params = {
	  CollectionId: 'pdp_hk1', /* required */
	  MaxResults: 100
	};


	app.post('/getFaceID', (req, res) => {
		let { body } = req;
		let { imageName } = body;
		let imagename = "090220191120.png";

		AWS.config.update({region: 'us-east-2'});
		let rekognition = new AWS.Rekognition();
		rekognition.listFaces(params, function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else {
		  	console.log(data);
		  	//prune using image name
		  	let prunedData = data.Faces.filter(function(record) {
		  		return record.ExternalImageId == imagename;
		  	});
		  	return res.send(prunedData);
		  }    
		});
	})	
}