const fs = require('fs');
const moment = require('moment');

module.exports = function kyfw12306(req, res) {
  const {
    year = moment().year(),
    month = moment().month() + 1,
  } = req.query;

  const MM = moment(month, 'M').format('MM');

  const path = `./logs/kyfw12306/${year}-${MM}.json`;

  const statData = {
    info: [0],
    list: [0],
    query: [0],
  }

  if (!fs.existsSync(path)) {
    return res.send(JSON.stringify({
      statusCode: 0,
      message: 'success',
      data: statData,
    }));
  }


  fs.readFile(path, (err, chunk) => {
    const logData = JSON.parse('[' + `${chunk}`.slice(0, -2) + ']');

    logData.forEach(item => {
      if (/20.*Z/.test(item.datetime)) {
        item.datetime = item.datetime.replace('T', ' ').slice(0, -5);
      }

      if (item.path === '/12306/info') {
        const date = moment(item.datetime).date();
        statData.info[date] = statData.info[date] || 0;
        statData.info[0]++
        statData.info[date]++
      }

      if (item.path === '/12306/list') {
        const date = moment(item.datetime).date();
        statData.list[date] = statData.list[date] || 0;
        statData.list[0]++
        statData.list[date]++
      }

      if (item.path === '/12306') {
        const date = moment(item.datetime).date();
        statData.query[date] = statData.query[date] || 0;
        statData.query[0]++
        statData.query[date]++
      }
    })

    res.send(JSON.stringify({
      statusCode: 0,
      message: 'success',
      data: statData
    }));
  })
}
