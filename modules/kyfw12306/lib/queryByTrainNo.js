const https = require('https');

module.exports = function queryByTrainNo({ trainDate, trainNo, fromStationTelecode = 'BBB', toStationTelecode = 'BBB' }) {

  return new Promise((resolve, reject) => {

    const options = {
      host: 'kyfw.12306.cn',
      path: `/otn/czxx/queryByTrainNo?train_no=${trainNo}&from_station_telecode=${fromStationTelecode}&to_station_telecode=${toStationTelecode}&depart_date=${trainDate}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36'
      }
    };

    let count = 0;

    (function get() {
      count++;

      if (count > 30) {
        return reject({
          type: 'query',
          reason: `train_date: ${trainDate}, train_no: ${trainNo}, from_station_telecode: ${fromStationTelecode}, to_station_telecode: ${toStationTelecode}. query fail`,
          message: 'Server buzy, please retry later.'
        });
      }

      const req = https.get(options, res => {
        const { statusCode } = res;
        let html = '';

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
            try {
              const result = JSON.parse(html);
              resolve(result);
            } catch (error) {
              req.abort();
              get();
            }
          })
        }
      }).on('error', err => {
        console.log(err);
        req.abort();
        get();
      })
    })();
  })
}