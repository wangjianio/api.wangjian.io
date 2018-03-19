const { log } = require('../../utils');

module.exports = (req = {}, obj = {}) => {
  const { url, method, query, params, headers, route } = req;

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
