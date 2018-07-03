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

  // log 不提交到 git，在此创建日志文件夹
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
  }

  if (!fs.existsSync('logs/' + path)) {
    fs.mkdirSync('logs/' + path);
  }


  // 文件路径 logs/project/2018-01.json
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