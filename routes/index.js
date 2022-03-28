const router = require('express').Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.status(200).send('Home page!');
});

router.post('/', (req, res) => {
  console.log(req.body);
  res.status(200);
});

module.exports = router;
