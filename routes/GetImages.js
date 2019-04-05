const moment = require('moment');
const config = require('../config/dev');

async function getObject(key) {
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

bTB64 = async (blob) => {
	var base64Image = await new Buffer( blob, 'binary' ).toString('base64');
	return base64Image;
}

module.exports = (app, AWS) => {
	let bucketParams = {
		Bucket: config.bucket
	};

	app.post('/getImages', (req, res) => {
		let { body } = req;
		let { faceID } = body;
		let { externalID } = body;
		AWS.config.update({region: 'us-east-1'});
		s3 = new AWS.S3({apiVersion: '2019-03-24'});
		AWS.config.update({region: 'us-east-2'});
		let rekognition = new AWS.Rekognition();
		let params = {
		 CollectionId: config.collectionName, 
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
		  	if(FinalLength == 0) {
		  		return res.send([])
		  	}
		  	prunedData.push(externalID);
		  	data.FaceMatches.forEach(async function(record) {
		  		prunedData.push(record.Face.ExternalImageId)
		  		currentLength++;
		  		if(currentLength == FinalLength) {
		  			let returnedData = [];
		  			for(let i=0;i<prunedData.length;i++) {
						let res = await getObject(prunedData[i]);
						returnedData.push(res);
					}
					returnedData.sort((a, b) => {
						return new Date(b.LastModified) - new Date(a.LastModified);
				  	})
					return res.send(returnedData);
				}
		  	})
		  	
		  }    
		});
	})	
}