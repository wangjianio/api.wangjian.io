const express = require('express');
const chalk = require('chalk');
const moment = require('moment');
const bodyParser = require('body-parser');
const router = require('./modules/router');
const mongo = require('./utils/mongo');

const app = express();

app.use(bodyParser.json());

router(app);

app.listen(10002, async () => {
  console.log('SERVER START:', chalk.magenta(moment().format('YYYY-MM-DD HH:mm:ss')));
  await mongo.connect();
})
