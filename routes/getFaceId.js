// Gives bounding box
const sharp = require('sharp');
const Parallel = require('async-parallel');
let image_height = 900;
let image_width = 1440;
let imageBlob;

async function getObject(key) {
	let params = {
		Bucket: 'cromdev',
		Key: key
	};
	let comp = await s3.getObject(params).promise();
	imageBlob = comp.Body;
	return comp;
}

bTB64 = async (blob) => {
	var base64Image = await new Buffer( blob, 'binary' ).toString('base64');
	return base64Image;
}

async function getCroppedFace(value) {
	console.log(value);
	const left = value.BoundingBox.Left > 0 ? Math.floor(value.BoundingBox.Left*image_width) : 0;
	const top = value.BoundingBox.Top > 0 ? Math.floor(value.BoundingBox.Top*image_height) : 0;
	const width =  Math.floor(value.BoundingBox.Width*image_width);
	const height = Math.floor(value.BoundingBox.Height*image_height);
	let image = await sharp(imageBlob).extract({ left, top, width, height })
	.toBuffer({resolveWithObject: true})
	let base64 = await bTB64(image.data);
	let newImage = {body: base64, FaceId: value.FaceId, ExternalImageId: value.ExternalImageId, BoundingBox: value.BoundingBox}
	return newImage;
}

module.exports = (app, AWS) => {
	let params = {
	  CollectionId: 'pdp_hk1', /* required */
	  MaxResults: 1000
	};


	app.post('/getFaceID', async (req, res) => {
		let { body } = req;
		let { imageName } = body;
		// let imagename = "090220191120.png";
		console.log(imageName);
		AWS.config.update({region: 'us-east-1'});
		s3 = new AWS.S3({apiVersion: '2019-03-24'});
		let image = await getObject(imageName);
		AWS.config.update({region: 'us-east-2'});
		let rekognition = new AWS.Rekognition();
		rekognition.listFaces(params, async function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else {
		  	//prune using image name
		  	let prunedData = data.Faces.filter(function(record) {
		  		return record.ExternalImageId == imageName;
		  	});

		  	let returnedData = [];
		  	let res1 = await (async function(){
				await Parallel.each(prunedData, async value => {
					if(value.BoundingBox.Left>0 && value.BoundingBox.Top>0) {
						let res2 = await getCroppedFace(value);
						returnedData.push(res2);
					}
				})
			})();
			return res.send(returnedData);
		  }
		});
	})	
}