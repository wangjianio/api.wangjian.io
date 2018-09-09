const { log } = require('../../utils');
const update = require('./update');

module.exports = (req = {}, obj = {}) => {
  const { url, method, query, params, headers, route } = req;

  // 周日上午更新
  // if (new Date().getDay() === 0 && new Date().getHours() < 12) {
  //   update();
  // }


  const newObj = {
    ...obj,
    url,
    path: route.path,
    method,
    query,
    params,
    userAgent: headers['user-agent'],
  }

  log('kyfw12306', newObj);
}
