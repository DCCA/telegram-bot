const NOMICS_API = process.env.NOMICS_API;
const TELEGRAM_API = process.env.TELEGRAM_API;
const fetch = require('node-fetch');
const numeral = require('numeral');

exports.getTicker = async (req, res, next) => {
	console.log(req.body);
	// Change this currency to get from chatbot
	const currencyId = req.body.message.text;
	const chatId = req.body.chat.id;
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
	await fetch(`https://api.telegram.org/bot${TELEGRAM_API}/sendMessage`, {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.parse({
			from: 'CryptoBot',
			text: `${currencyName}: ${formattedPrice}`,
			chat_id: chatId,
		}),
	});
	return res.status(200).json(true);
};
