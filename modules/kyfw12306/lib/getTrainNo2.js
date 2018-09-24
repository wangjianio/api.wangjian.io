const https = require('https');


module.exports = function getTrainNo({ date, trainCode }) {
  if (!date || !trainCode) {
    return console.log('getTrainNo2: 缺少参数。');
  }

  return new Promise((resolve, reject) => {

    const options = {
      host: 'mobile.12306.cn',
      path: `/weixin/wxcore/queryTrain?ticket_no=${trainCode}&depart_date=${date}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36'
      },
    };

    const req = https.get(options, res => {
      const { statusCode } = res;
      let html = '';

      if (statusCode !== 200) {
        req.abort();
      } else {
        res.on('data', chunk => {
          html += chunk;
        });

        res.on('end', () => {
          const result = JSON.parse(html);

          if (result.httpstatus === 200) {
            const { data } = result;
            const map = data.find(item => {
              return item.ticket_no === trainCode;
            })

            if (map) {
              resolve(map.train_code);
            } else {
              reject('error: getTrainNo not found')
            }
          } else {
            reject('error: getTrainNo')
          }
        })
      }
    }).on('error', err => {
      reject(err);
    })
  })
}