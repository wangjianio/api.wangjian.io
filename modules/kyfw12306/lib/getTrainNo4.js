module.exports = function getTrainNo4({ trainCode, trainDate } = {}) {
  trainDate = trainDate.replace(/-/g, '');

  return global.axios({
    url: 'https://search.12306.cn/search/v1/train/search',
    params: {
      keyword: trainCode,
      date: trainDate,
    }
  }).then(response => {
    const info = response.data.data.find(item => item.station_train_code === trainCode);
    if (info) {
      return info.train_no;
    }
    throw {
      message: 'getTrainNo4'
    }
  })
}