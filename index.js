const express = require('express');
const chalk = require('chalk');
const moment = require('moment');
const bodyParser = require('body-parser');
const router = require('./modules/router');
const mongo = require('./utils/mongo');
const axios = require('axios');

global.axios = axios;

axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';



const app = express();

app.use(bodyParser.json());

router(app);

app.listen(10002, async () => {
  console.log('SERVER START:', chalk.magenta(moment().format('YYYY-MM-DD HH:mm:ss')));
  await mongo.connect();
})
