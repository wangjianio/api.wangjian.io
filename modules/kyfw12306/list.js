const moment = require('moment');
const sendMail = require('../mail/send');
const getTrainNo = require('./lib/getTrainNo');
const queryByTrainNo = require('./lib/queryByTrainNo');
const getStationTelecode = require('./lib/getStationTelecode');
const mongo = require('../../utils/mongo');

module.exports = async function list(request, response) {
  try {
    const collection = mongo.db.db(`kyfw12306_${process.env.NODE_ENV}`).collection('list_log');

    const { query } = request;
    const { train_code, from_station_name, train_date } = query;
    console.log(JSON.stringify(query));

    collection.insertOne({
      ...query,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
    });

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


    const fromStationTelecode = await getStationTelecode(fromStationName);
    const trainNo = await getTrainNo({ trainCode, trainDate });
    const json = await queryByTrainNo({ trainDate, trainNo, fromStationTelecode });

    const { data } = json.data;

    const startIndex = data.findIndex(item => item.station_name === fromStationName);
    const list = data.filter((item, index) => index > startIndex).map(item => item.station_name);

    response.send(JSON.stringify({
      statusCode: 0,
      message: 'success',
      data: list,
    }));

  } catch (error) {
    console.log(error);
    sendMail(
      `【api.wangjian.io/12306】${error.type} 获取失败`,
      `${decodeURIComponent(request.url)}\n${request.headers['user-agent']}\n${error.reason}`
    );
    response.send(JSON.stringify({
      statusCode: 0,
      message: error.message,
      data: [],
    }));
  }
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