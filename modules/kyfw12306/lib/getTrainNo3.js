const trainList = require('./train_list.json');
const getTrainNo1 = require('./getTrainNo1');
const getTrainNo2 = require('./getTrainNo2');

module.exports = function getTrainNo({ date, trainCode, from } = {}) {
  return new Promise((resolve, reject) => {
    try {
      let key = 'O';
      if (['C', 'D', 'G', 'K', 'T', 'Z'].includes(trainCode[0])) {
        key = trainCode[0];
      }

      const matched = trainList[date][key].find(item => {
        const pattern = new RegExp(`${trainCode}\\(`);
        return pattern.test(item.station_train_code);
      });

      if (matched) {
        resolve(matched.train_no);
      } else {
        // getTrainNo1({ date, trainCode, from }).then(trainNo => {
        //   resolve(trainNo);
        // }, err => {
          // getTrainNo2({ date, trainCode, from }).then(trainNo => {
          //   resolve(trainNo);
          // }, err => {
          //   reject('error: getTrainNo');
          // })
        // })
      }

    } catch (error) {
      reject('error: getTrainNo');
      console.log(error);
    }
  });
}
