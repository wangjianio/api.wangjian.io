const https = require('https');
const fs = require('fs');
const moment = require('moment');
const sendMail = require('../mail/send');
const getTrainNo = require('./lib/getTrainNo2');
const queryByTrainNo = require('./lib/queryByTrainNo');
const getStationTelecode = require('./lib/getStationTelecode');


module.exports = (request, response) => {
  const { query } = request;
  console.log(JSON.stringify(query));

  const { train_code, from_station_name, train_date } = query;

  const fromStationTelecode = getStationTelecode(from_station_name);

  if (!fromStationTelecode) {
    sendMail('【api.wangjian.io/12306】telecode 获取失败', `${from_station_name}\n${decodeURI(request.url)}\n${request.headers['user-agent']}`);

    return response.send(JSON.stringify({
      statusCode: 4002,
      message: `Wrong station_name: ${from_station_name}`,
    }));
  }

  getTrainNo({
    trainCode: train_code,
    from: from_station_name,
    date: train_date,
  }).then(trainNo => {
    queryByTrainNo({
      trainDate: train_date,
      fromStationTelecode,
      trainNo,
    }).then(json => {
      const { data } = json.data;

      const startIndex = data.findIndex(item => item.station_name === from_station_name);

      const list = data.filter((item, index) => index > startIndex).map(item => item.station_name);

      response.send(JSON.stringify({
        statusCode: 0,
        message: 'success',
        data: list,
      }));
    })

  }, err => { throw err });
}