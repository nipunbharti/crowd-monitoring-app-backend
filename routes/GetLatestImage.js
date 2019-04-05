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

	app.get('/getLatestImage', (req, res) => {
		AWS.config.update({region: 'us-east-1'});
		s3 = new AWS.S3({apiVersion: '2019-02-09'});
		s3.listObjects(bucketParams, async function(err, data) {
		  if (err) {
		    console.log("Error", err);
		  } else {
		  	let cam1 = data.Contents.filter(val => val.Key.includes('1cam'));
		  	let cam2 = data.Contents.filter(val => val.Key.includes('2cam'));
		  	cam1.sort((a, b) => {
		  		return new Date(b.LastModified) - new Date(a.LastModified);
		  	})
		  	cam2.sort((a, b) => {
		  		return new Date(b.LastModified) - new Date(a.LastModified);
		  	})
		  	let finalRes1 = await getObject(cam1[0].Key);
		  	let finalRes2 = await getObject(cam2[0].Key);
		  	// let finalRes = await convertBlobToBase64(recvievedData[recvievedData.length-1])
		  	// let image = sharp()
			return res.send({cam1: finalRes1, cam2: finalRes2});
		  }
		});
	})	
}