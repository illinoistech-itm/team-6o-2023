var express = require('express');
var router = express.Router();
const data = require('../data/credentials.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hawkstagram', client_id: data.web.client_id });
});

module.exports = router;
