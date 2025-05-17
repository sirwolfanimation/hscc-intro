var express = require('express');
var router = express.Router();
var auth=require("../middleware/verifyToken");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('bdpahistory', { title: 'Express' });
});

module.exports = router;
