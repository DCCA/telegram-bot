const NOMICS_API = process.env.NOMICS_API;
const TELEGRAM_API = process.env.TELEGRAM_API;
const fetch = require('node-fetch');
const numeral = require('numeral');

exports.getTicker = (req, res, next) => {
	// Change this currency to get from chatbot
	let currencyId = req.body.message.text.toUpperCase();
	if (currencyId[0] === '/') {
		currencyId = currencyId.split('/')[1];
	}
	const chatId = req.body.message.chat.id;
	console.log(req.body.message);
	let currencyName;
	let formattedPrice;
	let d1PriceChange;
	let d7PriceChange;
	let d30PriceChange;
	let d365PriceChange;
	// Build the URI
	const uri = `https://api.nomics.com/v1/currencies/ticker?key=${NOMICS_API}&ids=${currencyId}&interval=1d,7d,30d,365d`;
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
			d1PriceChange = numeral(data[0]['1d'].price_change_pct).format('0.00%');
			d7PriceChange = numeral(data[0]['7d'].price_change_pct).format('0.00%');
			d30PriceChange = numeral(data[0]['30d'].price_change_pct).format('0%');
			d365PriceChange = numeral(data[0]['365d'].price_change_pct).format('0%');
		})
		.then((result) => {
			fetch(`https://api.telegram.org/bot${TELEGRAM_API}/sendMessage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					from: 'CryptoBot',
					parse_mode: 'HTML',
					text: `<strong>Report</strong>:&#13;<strong>${currencyName}</strong>: ${formattedPrice}&#10;<strong>D1 - P. Var.</strong>: ${d1PriceChange}&#10;<strong>D7 - P. Var.</strong>: ${d7PriceChange}&#10;<strong>D30 - P. Var.</strong>: ${d30PriceChange}&#10;<strong>D365 - P. Var.</strong>: ${d365PriceChange}`,
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
