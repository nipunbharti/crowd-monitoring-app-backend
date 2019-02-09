module.exports = (app, AWS) => {
	let bucketParams = {
		Bucket: 'cromdev'
	};

	app.post('/getImages', (req, res) => {
		let { body } = req;
		let { faceID } = body;
		let { externalID } = body;
		console.log(body);
		AWS.config.update({region: 'us-east-2'});
		let rekognition = new AWS.Rekognition();
		let params = {
		 CollectionId: "pdp_hk1", 
		 FaceId: faceID, 
		 FaceMatchThreshold: 80, 
		 MaxFaces: 100
		};
		rekognition.searchFaces(params, function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else {
		  	let prunedData = [];
		  	let currentLength = 0;
		  	let FinalLength = data.FaceMatches.length;
		  	prunedData.push(externalID);
		  	data.FaceMatches.forEach(function(record) {
		  		console.log(record);
		  		prunedData.push(record.Face.ExternalImageId)
		  		currentLength++;
		  		if(currentLength == FinalLength)
		  			return res.send(prunedData);		
		  	})
		  	
		  }    
		});
	})	
}