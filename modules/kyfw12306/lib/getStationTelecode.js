const fs = require('fs');

module.exports = function getStationTelecode(stationName) {
  return new Promise((resolve, reject) => {
    if (!stationName) {
      return reject({
        type: 'telecode',
        reason: `station_name: ${stationName}. is null`,
        message: 'Empty station_name.'
      });
    }

    // 读取相关文件
    const stationNames = fs.readFileSync(__dirname + '/station_name.js').toString();

    // 正则匹配出相关结果
    const pattern = `\\|${stationName}\\|([A-Z]{3})\\|`;
    const result = stationNames.match(pattern);

    if (result) {
      resolve(result[1]);
    } else {
      reject({
        type: 'telecode',
        reason: `station_name: ${stationName}. match fail`,
        message: `Wrong station_name.`
      });
    }
  })
}