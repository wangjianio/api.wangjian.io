const fs = require('fs');

module.exports = async function getStationTelecode(stationName) {
  if (!stationName) {
    throw {
      type: 'telecode',
      reason: `station_name: ${stationName}. is null`,
      message: 'Empty station_name.'
    };
  }

  // 读取相关文件
  const stationNames = fs.readFileSync(__dirname + '/station_name.js').toString();

  // 正则匹配出相关结果
  const pattern = `\\|${stationName}\\|([A-Z]{3})\\|`;
  const result = stationNames.match(pattern);

  if (result) {
    return result[1];
  } else {
    throw {
      type: 'telecode',
      reason: `station_name: ${stationName}. match fail`,
      message: `Wrong station_name.`
    };
  }
}