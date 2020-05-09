// Packages
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// Create app
const app = express();

// Import routes
const tickerRoutes = require('./routes/ticker');

// App config
app.use(helmet());
app.use(bodyParser.json());

// Add routes
app.use(tickerRoutes);
app.get('/', (req, res, next) => {
	res.send('<h1>Connected</h2>');
});

// Error handling
app.use((error, req, res, next) => {
	console.log(error);
});

// Start server
console.log(process.env.PORT);
app.listen(process.env.PORT || 3000);
