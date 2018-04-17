const https = require('https');
const fs = require('fs');
const moment = require('moment');



module.exports = (req, res) => {

  const { query } = req;
  const response = res;

  console.log(query);

  /**
   * 车次。
   * 来源：短信。
   * @type {string}
   */
  const trainCode = query.train_code;

  /**
   * 出发车站。
   * 来源：短信。
   * @type {string}
   */
  const fromStationName = query.from_station_name;

  /**
   * 到达车站。
   * 来源：用户根据极速API选择或手动输入。
   * @type {string}
   */
  const toStationName = query.to_station_name;

  /**
   * 出发日期。
   * 来源：短信。
   * @type {string}
   */
  const trainDate = query.train_date;


  // 根据 stationName 获取 stationTelecode
  const fromStationTelecode = getStationTelecode(fromStationName);
  const toStationTelecode = getStationTelecode(toStationName);

  // 获取 trainNo
  getTrainNo(trainDate, fromStationTelecode, toStationTelecode, trainCode).then(res => {
    return res;
  }, err => {
    throw err
  }).then(trainNo => {
    getResult(trainDate, fromStationTelecode, toStationTelecode, trainNo).then(res => {
      const json = JSON.parse(res);
      if (json.data.data) {
        const result = execResult(json.data.data, fromStationName, toStationName, trainDate);
        console.log(result);
        response.send(JSON.stringify(result));
      } else {
        console.log('数据有误');
        response.send(JSON.stringify({
          statusCode: 400,
          message: '12306 返回数据有误，请稍后重试',
        }));
      }
    }, err => {
      console.log(err);
      response.send(JSON.stringify({
        statusCode: 400,
        message: err,
      }));
    });
  }, err => {
    console.log(err);
    response.send(JSON.stringify({
      statusCode: 400,
      message: err,
    }));
  });
}


/**
 * 获取 stationTelecode。
 * @param {string} stationName
 * @returns {string} stationTelecode。
 */
function getStationTelecode(stationName) {
  if (!stationName) {
    return console.log('getStationTelecode: 缺少参数。');
  }
  // 读取相关文件
  const stationNames = fs.readFileSync(__dirname + '/lib/station_name.js').toString();

  // 正则匹配出相关结果
  const pattern = `\\|${stationName}\\|([A-Z]{3})\\|`;
  const result = stationNames.match(pattern);

  return result ? result[1] : console.log('getStationTelecode: 未找到 "' + stationName + '" 对应的 telecode。');
}


/**
 * 获取 trainNo。
 * @param {string} date  发车日期
 * @param {string} from  出发站的 telecode
 * @param {string} to    到达站的 telecode
 * @param {string} trainCode 车次
 */
function getTrainNo(date, from, to, trainCode) {
  if (!date || !from || !to || !trainCode) {
    return console.log('getTrainNo: 缺少参数。');
  }

  return new Promise((resolve, reject) => {

    let count = 0;

    // const url = `https://kyfw.12306.cn/otn/leftTicket/queryZ?leftTicketDTO.train_date=${date}&leftTicketDTO.from_station=${from}&leftTicketDTO.to_station=${to}&purpose_codes=ADULT`;
    const options = {
      host: 'kyfw.12306.cn',
      path: `/otn/leftTicket/query?leftTicketDTO.train_date=${date}&leftTicketDTO.from_station=${from}&leftTicketDTO.to_station=${to}&purpose_codes=ADULT`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
      },
    };

    (function get() {
      count++;

      if (count > 30) {
        return reject('查询失败，请稍后重试。');
      }


      const req = https.get(options, res => {
        const { statusCode } = res;
        let html = '';

        console.log('第', count, '次查询。');

        if (statusCode !== 200) {
          req.abort();
          get();

          res.on('end', () => {
            console.log('FAIL:', statusCode);
          })
        } else {
          res.on('data', chunk => {
            html += chunk;
          });
          res.on('end', () => {

            const pattern = `\\|(.{12})\\|${trainCode}\\|`;
            const result = html.match(pattern);

            if (!html.length) {
              console.log('FAIL:', statusCode);
              return get();
            }

            console.log('SUCCESS');

            result ? resolve(result[1]) : reject('getTrainNo: 未找到 "' + trainCode + '" 对应的 trainNo');
          })
        }
      }).on('error', err => {
        reject(err);
      })
    })();

  }); // Promise
}



function getResult(trainDate, fromStationTelecode, toStationTelecode, trainNo) {
  return new Promise((resolve, reject) => {

    let count = 0;

    // url: `https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=${trainNo}&from_station_telecode=${fromStationTelecode}&to_station_telecode=${toStationTelecode}&depart_date=${trainDate}`,
    const options = {
      host: 'kyfw.12306.cn',
      path: `/otn/czxx/queryByTrainNo?train_no=${trainNo}&from_station_telecode=${fromStationTelecode}&to_station_telecode=${toStationTelecode}&depart_date=${trainDate}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
      }
    };

    (function get() {
      count++;

      if (count > 30) {
        return reject('查询失败，请稍后重试。');
      }


      const req = https.get(options, res => {
        const { statusCode } = res;
        let html = '';

        console.log('第', count, '次查询。');

        if (statusCode !== 200) {
          req.abort();
          get();

          res.on('end', () => {
            console.log('FAIL:', statusCode);
          })
        } else {
          res.on('data', chunk => {
            html += chunk;
          });
          res.on('end', () => {
            console.log('SUCCESS');
            resolve(html);
          })
        }
      }).on('error', err => {
        reject(err);
      })
    })();

  }); // Promise
}



function execResult(array, fromStationName, toStationName, trainDate) {
  let day = 0;
  let startTime;
  let arriveTime;
  let lastStartTime;

  array.forEach(item => {
    const { station_name, start_time, arrive_time, isEnabled } = item;

    if (station_name === fromStationName) {
      // 行程开始时间
      startTime = start_time;

      // 记录第一站发车时间
      lastStartTime = start_time;
    } else if (isEnabled) {
      if (station_name === toStationName) {
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

  const startDateStamp = new Date(trainDate).getTime();
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

