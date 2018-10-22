const cp = require('child_process');
const fs = require('fs');

const trainList = require('./train_list.json');


module.exports = function getTrainNo({ date, trainCode } = {}) {
  
  let key = 'O';
  if (['C', 'D', 'G', 'K', 'T', 'Z'].includes(trainCode[0])) {
    key = trainCode[0];
  }

  const data = trainList[data][key];

  data.find(item => {
    return //.test(item.train_no);
  })
}
