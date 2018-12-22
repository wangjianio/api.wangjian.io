module.exports = async function queryByTrainNo({ trainDate, trainNo, fromStationTelecode = 'BBB', toStationTelecode = 'BBB' }) {

  let count = 0;

  return get();

  function get() {
    count++;

    return global.axios({
      url: 'https://kyfw.12306.cn/otn/czxx/queryByTrainNo',
      params: {
        train_no: trainNo,
        from_station_telecode: fromStationTelecode,
        to_station_telecode: toStationTelecode,
        depart_date: trainDate,
      }
    }).then(response => {
      if (count > 30) {
        throw {
          type: 'query',
          reason: `train_date: ${trainDate}, train_no: ${trainNo}, from_station_telecode: ${fromStationTelecode}, to_station_telecode: ${toStationTelecode}. query fail`,
          message: 'Server buzy, please retry later.'
        };
      }

      if (response.status === 200) {
        return response.data;
      } else {
        console.log('FAIL:', response.status);
        return get();
      }
    })
  }
}
