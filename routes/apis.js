var express = require('express');
var moment = require('moment');
var router = express.Router();



/* GET users listing. */
router.get('/time', function(req, res, next) {
	console.log('I have got a request for time');
	moment.locale(req.query.locale);
		var now = moment().format('llll');
		
  res.send(now);
});

module.exports = router;
