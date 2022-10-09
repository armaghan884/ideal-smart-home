const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//Using mysql2 since mysql wasn't working well
const mysql = require('mysql2');

//connecting to the databse
const port = 8089;
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'twa@3001',
	database: 'smarthome'
});

// connect to database
db.connect((err) => {
	if (err) {
		throw err;
	}
	console.log('Connected to database');
});
global.db = db;
app.use(bodyParser.urlencoded({ extended: true }));
require('./routes/main')(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use('/public/images', express.static(__dirname + '/public/images'));
app.listen(port, () =>
	console.log(`Example app listening on port ${port}!`)
);
