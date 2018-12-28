const express = require('express');
const chalk = require('chalk');
const moment = require('moment');
const bodyParser = require('body-parser');
const router = require('./modules/router');
const mongo = require('./utils/mongo');
const axios = require('axios');

global.axios = axios;

axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
// TODO: 动态获取 cookie
axios.defaults.headers.common['Cookie'] = 'RAIL_EXPIRATION=1546230124604; RAIL_DEVICEID=bv1CvurlKB480zbJghKl87TZWFjvG-eM-0L6dsD46N7nn7DMlPOwc4xyHpNpI9ZNZgRY7wj3pHZLt5UG5KmlqkVc-40-ohEw00XHott6Oi0SfmeYXbjkVbqg6ftna9914vUzS1EgtyCm7n7asvjWhDKGvRpKtZn1; route=c5c62a339e7744272a54643b3be5bf64; BIGipServerotn=1206911498.38945.0000; BIGipServerpool_index=787481098.43286.0000';



const app = express();

app.use(bodyParser.json());

router(app);

app.listen(10002, async () => {
  console.log('SERVER START:', chalk.magenta(moment().format('YYYY-MM-DD HH:mm:ss')));
  await mongo.connect();
})
