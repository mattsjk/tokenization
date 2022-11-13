const express = require('express');
const app = express();


// Define and manage the routing here
var defaultRouter = require('./routes/default');

app.use('/', defaultRouter);

// HTTP request error handling
// Middleware router to catch any routing errors
app.use(function(req, res, next) {
	let err = new Error("The requested URL \"" + req.path + "\" does not exist!");
	err.code = 404;
	next(err);
});
app.use((err, req, res, next) => {
	var errorMsg = "Error: Request Method: " + req.method + ", Status Code: " + err.code + ", Message: " + err.message;
	console.log(errorMsg);

	// Display the error details
	res.status(err.code || 500);
	res.send('Error: status code = ' + err.code + ' message = ' + err.message);
});

// Set the application service port
const PORT = parseInt(process.env.PORT) || 3000;

// Start the application service
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;