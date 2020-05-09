const NOMICS_API = process.env.NOMICS_API;
const TELEGRAM_API = process.env.TELEGRAM_API;
const fetch = require('node-fetch');
const numeral = require('numeral');

exports.getTicker = async (req, res, next) => {
	console.log(req.body);
	// Change this currency to get from chat bot
	const currencyId = req.body.message.text;
	const chatId = req.body.message.chat.id;
	// Build the URI
	const uri = `https://api.nomics.com/v1/currencies/ticker?key=${NOMICS_API}&ids=${currencyId}&interval=1d`;
	// Get response
	try {
		const rawData = await fetch(uri, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = rawData.json();
		const currencyName = data[0].name;
		const formattedPrice = numeral(data[0].price).format('$ 0.0000');
		const telegramResult = await fetch(
			`https://api.telegram.org/bot${TELEGRAM_API}/sendMessage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					from: 'CryptoBot',
					text: `${currencyName}: ${formattedPrice}`,
					chat_id: chatId,
				}),
			}
		);
		console.log(telegramResult);
		return res.status(200).json(true);
	} catch {
		const telegramResult = await fetch(
			`https://api.telegram.org/bot${TELEGRAM_API}/sendMessage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					from: 'CryptoBot',
					text: `No currency found`,
					chat_id: chatId,
				}),
			}
		);
		return res.status(200).json(true);
	}
};
