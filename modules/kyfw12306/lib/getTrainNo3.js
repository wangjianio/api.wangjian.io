const trainList = require('./train_list.json');

module.exports = function getTrainNo({ date, trainCode } = {}) {
  return new Promise((resolve, reject) => {
    try {
      let key = 'O';
      if (['C', 'D', 'G', 'K', 'T', 'Z'].includes(trainCode[0])) {
        key = trainCode[0];
      }
  
      const trainNo = trainList[date][key].find(item => {
        const pattern = new RegExp(`${trainCode}\\(`);
        return pattern.test(item.station_train_code);
      }).train_no;

      resolve(trainNo);
    } catch (error) {
      reject(error);
    }
  });
}
