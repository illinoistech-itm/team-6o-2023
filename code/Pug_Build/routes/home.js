var express = require('express');
var router = express.Router();
const decoder = require ('jwt-decode')

let idValue;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Hawkstagram'});
});

router.post('/', function(req, res, next) {

  const map = JSON.parse(JSON.stringify(req.body));
  const key = Object.keys(map);
  
  const responsePayload = decoder(key.toString());
  idValue = responsePayload.sub;
  console.log("ID: " + responsePayload.sub);
  console.log('Full Name: ' + responsePayload.name);
  console.log('Given Name: ' + responsePayload.given_name);
  console.log('Family Name: ' + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);
  

  res.redirect('/home/' + responsePayload.sub);
});

router.get('/:id', function(req, res, next) {
  res.render('home_logged_in', {title: 'Authenticated', id: req.params.id});
});

module.exports = router;
