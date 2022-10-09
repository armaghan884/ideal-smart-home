module.exports = function(app) {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');

	app.engine('html', require('ejs').renderFile);

	//Rendering the home page
	app.get('/', function(req, res) {
		res.render('index.html');
	});
	//Rendering the add device page
	app.get('/adddevice', function(req, res) {
		res.render('adddevice.html');
	});

	//Rendering the about page
	app.get('/about', function(req, res) {
		res.render('about.html');
	});

	//Posting the data to MYSQL table from the form input of adddevice.html page
	app.post('/addeddevice', function(req, res) {
		// saving data in database
		let sqlquery =
			'INSERT INTO added_devices (device_type, name, status, setting, extra_setting) VALUES (?,?,?,?,?)';
		// execute sql query
		let newrecord = [
			req.body.device_type,
			req.body.name,
			req.body.status,
			req.body.setting,
			req.body.extra_setting
		];
		db.query(sqlquery, newrecord, (err, result) => {
			if (err) {
				return console.error(err.message);
			} else
				//Shows a message that device has been added
				res.send(
					' This device has been added ' +
						req.body.device_type +
						' named ' +
						req.body.name +
						' with status ' +
						req.body.status
				);
		});
	});

	//Gets the data from the database to show in a html table
	app.get('/devicestatus', function(req, res, next) {
		//gets the data from the database
		let sqlquery = 'SELECT * FROM added_devices ORDER BY id DESC';
		//executes the query
		db.query(sqlquery, function(err, data) {
			if (err) {
				return console(err.message);
			} else {
				res.render('devicestatus', {
					title: 'All Devices ',
					action: 'list',
					deviceData: data
				});
			}
		});
	});

	// Delete's the device from the chosen id when delete button is pressed in the device status page
	app.get('/devicestatus/delete/:id', function(req, res, next) {
		let id = req.params.id;
		console.log(id);

		let sqlquery = `
		DELETE FROM added_devices WHERE id = "${id}"
		`;

		db.query(sqlquery, function(err, data) {
			if (err) {
				throw err;
			} else {
				res.redirect('/devicestatus');
			}
		});
	});
	//take us to the control device page when edit button is clicked
	app.get('/devicestatus/edit/:id', function(req, res, next) {
		let id = req.params.id;

		let sqlquery = `SELECT * FROM added_devices WHERE id = "${id}"`;

		db.query(sqlquery, function(err, data) {
			if (err) {
				throw err;
			} else {
				//request.flash('success', 'Sample Data Updated');
				res.render('controldevice', {
					title: 'Edit MySQL Table Data',
					deviceData: data[0]
				});
			}
		});
	});
	//use the id of the data and update setting when form is updated with new settings
	app.post('/controldevice/edit/:id', function(req, res, next) {
		var id = req.params.id;

		var device_type = req.body.device_type;

		var name = req.body.name;

		var status = req.body.status;

		var setting = req.body.setting;
		var extra_setting = req.body.extra_setting;
		//SQL query
		var sqlquery = `UPDATE added_devices SET device_type = "${device_type}", name = "${name}", status = "${status}", setting = "${setting}", extra_setting = "${extra_setting}" WHERE id = "${id}"`;
		//Executing the query
		db.query(sqlquery, function(error, data) {
			if (error) {
				throw error;
			} else {
				//takes us back to devicestatus page.
				res.redirect('/devicestatus');
			}
		});
	});
};
