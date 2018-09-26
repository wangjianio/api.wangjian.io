const express = require('express');
const app = express();
const router = require('./modules/router');
const bodyParser = require('body-parser');
const moment = require('moment');
const chalk = require('chalk');


app.use(bodyParser.json());

router(app);

app.listen(10002, () => {
  console.log('SERVER START:', chalk.magenta(moment().format('YYYY-MM-DD HH:mm:ss')));
})
