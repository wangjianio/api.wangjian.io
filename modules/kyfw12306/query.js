const moment = require('moment');
const sendMail = require('../mail/send');
const getTrainNo = require('./lib/getTrainNo1');
const queryByTrainNo = require('./lib/queryByTrainNo');
const getStationTelecode = require('./lib/getStationTelecode');
const mongo = require('../../utils/mongo');

module.exports = async (request, response) => {
  try {
    const collection = mongo.db.db(`kyfw12306_${process.env.NODE_ENV}`).collection('query_log');

    const { query } = request;

    console.log(JSON.stringify(query));

    collection.insertOne({
      ...query,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
    });

    const SMS_INFO = {
      train: query.train_code,
      from: query.from_station_name.replace('站', '').replace('world', ''),
      to: query.to_station_name.replace('站', '').replace('world', ''),
      date: getDate(query.train_date),
    }

    if (!SMS_INFO.train || !SMS_INFO.from || !SMS_INFO.to || !SMS_INFO.date) {
      const missed = [];

      !SMS_INFO.train && missed.push('train_code');
      !SMS_INFO.from && missed.push('from_station_name');
      !SMS_INFO.to && missed.push('to_station_name');
      !SMS_INFO.date && missed.push('train_date');

      sendMail('【api.wangjian.io/12306】错误传参', `${decodeURIComponent(request.url)}\n${request.headers['user-agent']}`);

      return response.send(JSON.stringify({
        statusCode: 4001,
        message: `Miss params: ${missed.join(', ')}`,
      }));
    }

    const fromStationTelecode = await getStationTelecode(SMS_INFO.from);
    const toStationTelecode = await getStationTelecode(SMS_INFO.to);

    if (!fromStationTelecode || !toStationTelecode) {
      const missed = [];

      !fromStationTelecode && missed.push(SMS_INFO.from);
      !toStationTelecode && missed.push(SMS_INFO.to);

      sendMail('【api.wangjian.io/12306】telecode 获取失败', `${missed.join(', ')}\n${decodeURI(request.url)}\n${request.headers['user-agent']}`);

      return response.send(JSON.stringify({
        statusCode: 4002,
        message: `Wrong station_name: ${missed.join(', ')}`,
      }));
    }

    const trainNo = await getTrainNo({
      trainCode: SMS_INFO.train,
      trainDate: SMS_INFO.date,
      date: SMS_INFO.date,
      from: fromStationTelecode,
      to: toStationTelecode,
      trainCode: SMS_INFO.train
    });

    const json = await queryByTrainNo({ trainDate: SMS_INFO.date, fromStationTelecode, toStationTelecode, trainNo });
    const { data } = json.data;
    const result = execResult(data, SMS_INFO.from, SMS_INFO.to, SMS_INFO.date);

    console.log(JSON.stringify(result));
    response.send(JSON.stringify(result));
  } catch (error) {
    console.log(error);
    response.send(JSON.stringify({
      statusCode: 500,
      message: 'error',
    }));
  }
}


/**
 * * * * * * * * * * * 函数们 * * * * * * * * * *
 */

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


function execResult(array, fromStationNameFromSms, toStationNameFromSms, trainDateFromSms) {
  let day = 0;
  let startTime;
  let arriveTime;
  let lastStartTime;

  array.forEach(item => {
    const { station_name, start_time, arrive_time, isEnabled } = item;

    if (station_name === fromStationNameFromSms) {
      // 行程开始时间
      startTime = start_time;

      // 记录第一站发车时间
      lastStartTime = start_time;
    } else if (isEnabled) {
      if (station_name === toStationNameFromSms) {
        // 如果车站为下车站使用 arrive_time 判断 day 是否增加
        if (arrive_time < lastStartTime) {
          day++;
        }
        arriveTime = arrive_time;
      } else if (start_time < lastStartTime) {
        // 如果车站非下车站使用上一站发车时间判断 day 是否增加
        day++;
      }
      // 记录本站发车时间，用于下次比较
      lastStartTime = start_time;
    }
  });

  const startDateStamp = new Date(trainDateFromSms).getTime();
  const arriveDateStamp = startDateStamp + 24 * 3600 * 1000 * day;

  const startDate = moment(startDateStamp).format('YYYY-MM-DD');
  const arriveDate = moment(arriveDateStamp).format('YYYY-MM-DD');


  const startDatetime = startDate + ' ' + startTime;
  const arriveDatetime = arriveDate + ' ' + arriveTime;

  const startStamp = moment(startDatetime).unix();
  const arriveStamp = moment(arriveDatetime).unix();

  const lastTimeText = getLastTimeText(arriveStamp - startStamp);

  return {
    statusCode: 0,
    message: 'success',
    start_datetime: startDatetime,
    arrive_datetime: arriveDatetime,
    last_time: lastTimeText,
  }
}


function getLastTimeText(seconds) {
  const lastHour = Math.floor(seconds / 3600);
  const lastMin = Math.floor(seconds % 3600 / 60);

  const lastHourText = lastHour ? lastHour + '小时' : '';
  const lastMinText = lastMin ? lastMin + '分钟' : '';

  return lastHourText + lastMinText;
}

