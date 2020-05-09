const NOMICS_API = process.env.NOMICS_API;
const fetch = require('node-fetch');
const numeral = require('numeral');

exports.getTicker = async (req, res, next) => {
	// Change this currency to get from chatbot
	const currencyId = req.body.result[0].message.text;
	// Build the URI
	const uri = `https://api.nomics.com/v1/currencies/ticker?key=${NOMICS_API}&ids=${currencyId}&interval=1d`;
	// Get response
	const dataRaw = await fetch(uri, {
		headers: {
			'Content-Type': 'application/json',
		},
	});
	// Transform to JSON
	const data = await dataRaw.json();
	if (!data) {
		const err = new Error('No data found');
		err.statusCode = 404;
		throw err;
	}
	console.log(data);
	const currencyName = data[0].name;
	const formattedPrice = await numeral(data[0].price).format('$ 0.0000');
	return res.status(200).json({
		message: {
			id: currencyId,
			currency: currencyName,
			price: formattedPrice,
		},
	});
};
