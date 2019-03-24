const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 8000;
const AWS = require('aws-sdk');
// const config = require('./config/AWS_Keys.js')
AWS.config.loadFromPath('./config/AWS-Keys.json');
app.use(bodyParser.json());

require('./routes/TimeSliced')(app, AWS);
require('./routes/getFaceID')(app, AWS);
require('./routes/getImages')(app, AWS);
require('./routes/TestApi')(app, AWS);
require('./routes/GetLatestImage')(app, AWS);
require('./routes/GetCroppedImages')(app, AWS);

app.listen(port, function() {
	console.log(`Server on ${port}`);
});