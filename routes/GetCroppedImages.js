// Hackathon 2
const sharp = require('sharp');
const Parallel = require('async-parallel');
let image_height = 900;
let image_width = 1440;

let imageBlob;

async function getObject(key) {
	let params = {
		Bucket: 'pdpdev',
		Key: key
	};
	let comp = await s3.getObject(params).promise();
	imageBlob = comp.Body;
	let base64 = await bTB64(comp.Body);
	comp["Body"] = base64;
	comp["name"] = key;
	return comp;
}

async function getCroppedFace(value) {
	const left = Math.floor(value.BoundingBox.Left*image_width), top = Math.floor(value.BoundingBox.Top*image_height), width = Math.floor(value.BoundingBox.Width*image_width), height = Math.floor(value.BoundingBox.Height*image_height);
	let image = await sharp(imageBlob).extract({ left, top, width, height })
	.toBuffer({resolveWithObject: true})
	let base64 = await bTB64(image.data);
	let newImage = {body: base64, faceId: value.FaceId}
	return newImage;
}

bTB64 = async (blob) => {
	var base64Image = await new Buffer( blob, 'binary' ).toString('base64');
	return base64Image;
}

module.exports = (app, AWS) => {
	let bucketParams = {
		Bucket: 'pdpdev'
	};

	app.post('/getCroppedImage', async (req, res) => {
		let { body } = req;
		let { imageName } = body;
		let { data } = body;
		
		AWS.config.update({region: 'us-east-1'});
		s3 = new AWS.S3({apiVersion: '2019-02-09'});
		let image = await getObject(imageName);
		let returnedData = [];
		let res1 = await (async function(){
			await Parallel.each(data, async value => {
				let res2 = await getCroppedFace(value);
				returnedData.push(res2);
			})
		})();
		let finalData = { imageBody: image, croppedData: returnedData}
		return res.send(finalData);
	})	
}