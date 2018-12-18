const https = require('https');

module.exports = function getTrainNo4({ trainCode, trainDate } = {}) {
  trainDate = trainDate.replace(/-/g, '');
  return new Promise((resolve, reject) => {

    const options = {
      host: 'search.12306.cn',
      path: `/search/v1/train/search?keyword=${trainCode}&date=${trainDate}`,
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

          if (result.status === true) {
            const { data } = result;
            const map = data.find(item => {
              return item.station_train_code === trainCode;
            })

            if (map) {
              resolve(map.train_no);
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