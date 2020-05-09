const NOMICS_API = process.env.NOMICS_API;
const TELEGRAM_API = process.env.TELEGRAM_API;
const fetch = require('node-fetch');
const numeral = require('numeral');

exports.getTicker = (req, res, next) => {
	console.log(req.body);
	// Change this currency to get from chatbot
	const currencyId = req.body.message.text;
	const chatId = req.body.message.chat.id;
	let currencyName;
	let formattedPrice;
	// Build the URI
	const uri = `https://api.nomics.com/v1/currencies/ticker?key=${NOMICS_API}&ids=${currencyId}&interval=1d`;
	// Get response
	fetch(uri, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((ressult) => {
			return ressult.json();
		})
		.then((data) => {
			if (!data) {
				const err = new Error('No data found');
				err.statusCode = 404;
				throw err;
			}
			currencyName = data[0].name;
			formattedPrice = numeral(data[0].price).format('$ 0.0000');
		})
		.then((ressult) => {
			fetch(`https://api.telegram.org/bot${TELEGRAM_API}/sendMessage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					from: 'CryptoBot',
					text: `${currencyName}: ${formattedPrice}`,
					chat_id: chatId,
				}),
			})
				.then((ressult) => {
					console.log(ressult);
				})
				.catch((err) => {
					console.log(err);
				});
			return res.status(200).json(true);
		})
		.catch((err) => {
			console.log(err);
		});
};
