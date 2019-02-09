const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

// require('./routes/fetchCount')(app);



app.listen(port, function() {
	console.log(`Server on ${port}`);
});