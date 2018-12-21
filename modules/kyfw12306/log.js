const { log } = require('../../utils');
const mongo = require('../../utils/mongo');
const moment = require('moment');

module.exports = (req = {}, obj = {}) => {
  const { url, method, query, params, headers, route } = req;

  const newObj = {
    ...obj,
    url: decodeURIComponent(url),
    path: route.path,
    method,
    query,
    params,
    userAgent: headers['user-agent'],
  }

  const collection = mongo.db.db(`kyfw12306_${process.env.NODE_ENV}`).collection('request_log');
  collection.insertOne({
    ...newObj,
    datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
  });

  log('kyfw12306', newObj);
}
