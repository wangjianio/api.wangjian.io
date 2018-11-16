const getTrainNo1 = require('./getTrainNo1');
const getTrainNo2 = require('./getTrainNo2');
const getTrainNo3 = require('./getTrainNo3');

module.exports = function getTrainNo({ trainCode, trainDate }) {
  return new Promise((resolve, reject) => {
    let trainNo2, trainNo3, complete = 0;

    getTrainNo2({ trainCode, trainDate }).then(_trainNo2 => {
      trainNo2 = _trainNo2;
    }, error => {
      trainNo2 = null;
    })

    getTrainNo3({ trainCode, trainDate }).then(_trainNo3 => {
      trainNo3 = _trainNo3;
    }, error => {
      trainNo3 = null;
    })

    const timer = setInterval(() => {
      if (trainNo3 === undefined) {
      } else if (trainNo3 === null) {
        if (trainNo2 === undefined) {
        } else if (trainNo2 === null) {
          clearInterval(timer);
          return reject({
            type: 'trainNo',
            reason: `train_code: ${trainCode}, train_date: ${trainDate}. found nothing`,
            message: 'Can not find train_no.'
          });
        } else {
          trainNo = trainNo2;
          resolve(trainNo);
          clearInterval(timer);
          return;
        }
      } else {
        trainNo = trainNo3;
        resolve(trainNo);
        clearInterval(timer);
        return;
      }
    }, 50);

    setTimeout(() => {
      clearInterval(timer);
      return reject({
        type: 'trainNo',
        reason: `train_code: ${trainCode}, train_date: ${trainDate}. both fail`,
        message: 'Can not get train_no.'
      })
    }, 5 * 1000);
  })
}