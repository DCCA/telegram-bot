const express = require('express');
const tickerController = require('../controllers/ticker');

const router = express.Router();
// https://api.nomics.com/v1/currencies/ticker?key=&ids=BTC

router.post('/ticker', tickerController.getTicker);

module.exports = router;
