const express = require('express');
const chalk = require('chalk');
const moment = require('moment');
const bodyParser = require('body-parser');
const router = require('./modules/router');
const mongo = require('./utils/mongo');
const axios = require('axios');

global.axios = axios;

axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36';
// TODO: 动态获取 cookie
axios.defaults.headers.common['Cookie'] = 'BIGipServerpool_statistics=669057546.44582.0000; RAIL_EXPIRATION=1548991791323; RAIL_DEVICEID=RnAskvw9ey4y0jjeV1NLM7ZWhcbMaw-xxsXQvX_r0P6lhKz8kj8nE9m5qQY61YPvDw4o3WzAsyvt6wMpDjhjwxNtsFs8Z8vBUm0kSyuR3r9NqWDZ2x2LHVPwEN4eO_HCBFRrq-7Bx3CwgYTQF8d2rTrw1VffW7KW';



const app = express();

app.use(bodyParser.json());

router(app);

app.listen(10002, async () => {
  console.log('SERVER START:', chalk.magenta(moment().format('YYYY-MM-DD HH:mm:ss')));
  await mongo.connect();
})
