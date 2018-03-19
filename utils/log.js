const fs = require('fs');

module.exports = (path, obj) => {
  const localeTimestamp = new Date().getTime() + 1000 * 3600 * 8;
  const ISOString = new Date(localeTimestamp).toISOString();
  const year = new Date(localeTimestamp).getFullYear();
  const month = new Date(localeTimestamp).getMonth() + 1;

  const newObj = {
    datetime: ISOString,
    ...obj,
  }

  const file = 'logs/' + path + '/' + year + '-' + pad(month) + '.json';
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