const https = require('https');

/**
 * 获取 trainNo。
 * @param {string} date  发车日期
 * @param {string} from  出发站的 telecode
 * @param {string} to    到达站的 telecode
 * @param {string} trainCode 车次
 */
module.exports = function getTrainNo({ date, from, to, trainCode }) {
  if (!date || !from || !to || !trainCode) {
    return console.log('getTrainNo: 缺少参数。');
  }

  return new Promise((resolve, reject) => {

    let count = 0;

    const options = {
      host: 'kyfw.12306.cn',
      path: `/otn/leftTicket/queryA?leftTicketDTO.train_date=${date}&leftTicketDTO.from_station=${from}&leftTicketDTO.to_station=${to}&purpose_codes=ADULT`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36'
      },
    };

    // console.log(options.host + options.path);

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
            html += `${chunk}`;
          });

          res.on('end', () => {

            const pattern = `\\|(.{12})\\|${trainCode}\\|`;
            const result = html.match(pattern);

            if (!html.length) {
              console.log('FAIL:', statusCode);
              return get();
            }

            console.log('SUCCESS');

            result ? resolve(result[1]) : reject(`getTrainNo: 未找到 ${trainCode} 对应的 trainNo`);
          })
        }
      }).on('error', err => {
        reject(err);
      })
    })();

  }); // Promise
}