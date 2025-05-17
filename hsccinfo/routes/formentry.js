var express = require('express');
var router = express.Router();
const auth=require("../middleware/verifyToken");

/* GET form entry page. */
router.get('/', function(req, res, next) {
  res.render('formentry', { title: 'Sample Data Entry' });
});

/* POST form submission. */
router.post('/', function(req, res, next) {
  const { firstname, lastname, email1, num1, num2, numconvert1, numconvert2 } = req.body;

  // Perform any necessary processing here
  const total = parseInt(num1) + parseInt(num2);
  const displaybin = numconvert1 === 'bin';
  const displayhex = numconvert2 === 'hex';

  const binnum1 = displaybin ? parseInt(num1).toString(2) : null;
  const binnum2 = displaybin ? parseInt(num2).toString(2) : null;
  const hexnum1 = displayhex ? parseInt(num1).toString(16) : null;
  const hexnum2 = displayhex ? parseInt(num2).toString(16) : null;

  res.render('formresults', {
    title: 'Form Results',
    fn: firstname,
    ln: lastname,
    em: email1,
    total,
    displaybin,
    displayhex,
    binnum1,
    binnum2,
    hexnum1,
    hexnum2,
  });
});

module.exports = router;