const NOMICS_API = process.env.NOMICS_API;
const TELEGRAM_API = process.env.TELEGRAM_API;
const fetch = require('node-fetch');
const numeral = require('numeral');

exports.getTicker = (req, res, next) => {
	// Change this currency to get from chatbot
	const currencyId = req.body.message.text.toUpperCase();
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
		.then((result) => {
			return result.json();
		})
		.then((data) => {
			if (data.length < 1) {
				fetch(`https://api.telegram.org/bot${TELEGRAM_API}/sendMessage`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						from: 'CryptoBot',
						text: `No data found`,
						chat_id: chatId,
					}),
				}).catch((err) => {
					console.log(err);
				});
				return res.status(200).json(true);
			}
			currencyName = data[0].name;
			formattedPrice = numeral(data[0].price).format('$ 0.0000');
		})
		.then((result) => {
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
				.then((result) => {
					console.log(result);
				})
				.catch((err) => {
					console.log(err);
				});
			return res.status(200).json(true);
		})
		.catch((err) => {
			const error = new Error(err);
			throw error;
		});
};
