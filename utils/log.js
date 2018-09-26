const fs = require('fs');
const moment = require('moment');

module.exports = (path, obj) => {

  const year = moment().year();
  const month = moment().month() + 1;

  const newObj = {
    datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
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