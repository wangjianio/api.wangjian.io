const fs = require('fs');

module.exports = (req = {}, obj = {}) => {
  const { url, method, query, params, headers, route } = req;

  const localeTimestamp = new Date().getTime() + 1000 * 3600 * 8;
  const ISOString = new Date(localeTimestamp).toISOString();
  const year = new Date(localeTimestamp).getFullYear();
  const month = new Date(localeTimestamp).getMonth() + 1;

  const newObj = {
    ...obj,
    datetime: ISOString,
    url,
    path: route.path,
    method,
    query,
    params,
    userAgent: headers['user-agent'],
  }

  const file = 'logs/kyfw12306/' + year + '-' + pad(month) + '.json';
  const data = JSON.stringify(newObj) + ',\n';
  const options = {
    flag: 'a',
  }

  fs.writeFileSync(file, data, options);
}

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}