const trainList = require('./train_list.json');
const getTrainNo1 = require('./getTrainNo1');
const getTrainNo2 = require('./getTrainNo2');

module.exports = function getTrainNo({ trainCode, trainDate, fromStationTelecode } = {}) {
  return new Promise((resolve, reject) => {
    try {
      let key = 'O';
      if (['C', 'D', 'G', 'K', 'T', 'Z'].includes(trainCode[0])) {
        key = trainCode[0];
      }

      const found = trainList[trainDate][key].find(item => {
        const pattern = new RegExp(`${trainCode}\\(`);
        return pattern.test(item.station_train_code);
      });

      if (found) {
        resolve({
          trainNo: found.train_no,
          trainCode,
          trainDate,
          fromStationTelecode,
        });
      } else {
        reject({
          type: 'trainNo',
          reason: `train_code: ${trainCode}, train_date: ${trainDate}. found nothing`,
          message: 'Can not find train_no.'
        });
      }

    } catch (error) {
      reject({
        type: 'trainNo',
        reason: `train_code: ${trainCode}, train_date: ${trainDate}. catch error`,
        message: 'Find train_no error.'
      });
    }
  });
}
