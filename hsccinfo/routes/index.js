var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (process.env.CONSOLE_DEBUG){
    console.log("Debugging enabled!");
  }
  res.render('index', { title: 'Express' });
});

module.exports = router;