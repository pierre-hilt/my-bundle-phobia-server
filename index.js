const express = require('express');
const app = express();
const port = 3000;
const stats = require('./app/stats');
const validate = require('validate-npm-package-name');

app.get('/', (req, res) =>
  res.send('Application root.\nEntry point: stats?package={package name}')
);

app.get('/api/stats', async function(req, res) {
  const packageName = req.query.package;
  const validateResults = validate(packageName);
  if (validateResults.errors) {
    res.status(500).send({
      error: 'Package name not valid'
    });
  } else {
    try {
      const packageStats = await stats(packageName);
      res.send(packageStats);
    } catch (err) {
      // Return generic error in case of catched error.
      res.status(500).send({
        error: err.toString()
      });
    }
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
