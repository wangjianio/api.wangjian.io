const moment = require('moment');
const sendMail = require('../mail/send');
const getTrainNo = require('./lib/getTrainNo');
const queryByTrainNo = require('./lib/queryByTrainNo');
const getStationTelecode = require('./lib/getStationTelecode');


module.exports = (request, response) => {
  const { query } = request;
  const { train_code, from_station_name, train_date } = query;
  console.log(JSON.stringify(query));

  if (!train_code || !from_station_name || !train_date) {
    return response.send(JSON.stringify({
      statusCode: 0,
      message: 'Missing params',
      data: [],
    }));
  }

  const trainCode = train_code;
  const trainDate = getDate(train_date);
  const fromStationName = from_station_name.replace('站', '').replace('world', '');

  let fromStationTelecode, trainNo;

  getStationTelecode(fromStationName).then(_fromStationTelecode => {
    fromStationTelecode = _fromStationTelecode;
    return getTrainNo({ trainCode, trainDate })
  }).then(_trainNo => {
    trainNo = _trainNo;
    return queryByTrainNo({ trainDate, trainNo, fromStationTelecode })
  }).then(json => {
    const { data } = json.data;

    const startIndex = data.findIndex(item => item.station_name === fromStationName);
    const list = data.filter((item, index) => index > startIndex).map(item => item.station_name);

    response.send(JSON.stringify({
      statusCode: 0,
      message: 'success',
      data: list,
    }));
  }).catch(err => {
    console.log(err)
    sendMail(
      `【api.wangjian.io/12306】${err.type} 获取失败`,
      `${decodeURI(request.url)}\n${request.headers['user-agent']}\n${err.reason}`
    );
    response.send(JSON.stringify({
      statusCode: 0,
      message: err.message,
      data: [],
    }));
  });
}

function getDate(date) {
  if (/\d+月\d+日/.test(date)) {
    const m = moment(date, 'M月D日');
    if (moment().month() - m.month() > 6) {
      return m.format(`${moment().year() + 1}-MM-DD`);
    } else {
      return m.format('YYYY-MM-DD');
    }
  }
  return date;
}