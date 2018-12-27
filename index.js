const express = require('express');
const chalk = require('chalk');
const moment = require('moment');
const bodyParser = require('body-parser');
const router = require('./modules/router');
const mongo = require('./utils/mongo');
const axios = require('axios');

global.axios = axios;

axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
axios.defaults.headers.common['Cookie'] = 'RAIL_EXPIRATION=1546129402314; RAIL_DEVICEID=Otw0i6GPbYUyVA9oXIBMhSsnnvrQF82_X2Toqo9vbLvhsITs2R23P44IyKWSz_DV7jwh3KwBzSh_AEuCvLy2TiT2ybytPobJPbwoH4wzcSZBrx1geT0jx1kCKrSr4K9i-bVFjW0b1HX4sIDnF_cFnsCuDtcP_Gai; BIGipServerpool_restapi=2262893066.44838.0000';



const app = express();

app.use(bodyParser.json());

router(app);

app.listen(10002, async () => {
  console.log('SERVER START:', chalk.magenta(moment().format('YYYY-MM-DD HH:mm:ss')));
  await mongo.connect();
})
