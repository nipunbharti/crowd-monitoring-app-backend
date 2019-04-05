const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/AWS-Keys.json');
const config = require('./config/dev');

const app = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json({limit: '10mb', extended: true}));
mongoose.connect(config.mongoURI, { useNewUrlParser: true });

require('./routes/TimeSliced')(app, AWS);
require('./routes/GetFaceID')(app, AWS);
require('./routes/GetImages')(app, AWS);
require('./routes/TestApi')(app, AWS);
require('./routes/GetLatestImage')(app, AWS);
require('./routes/GetCroppedImages')(app, AWS);
require('./routes/GetZonedData')(app, AWS);
require('./routes/SetTrue')(app);

app.listen(port, function() {
	console.log(`Server on ${port}`);
});