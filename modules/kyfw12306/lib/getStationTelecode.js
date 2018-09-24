const fs = require('fs');

module.exports = function getStationTelecode(stationName) {
  if (!stationName) {
    throw new Error('getStationTelecode: 缺少参数。');
  }

  // 读取相关文件
  const stationNames = fs.readFileSync(__dirname + '/station_name.js').toString();

  // 正则匹配出相关结果
  const pattern = `\\|${stationName}\\|([A-Z]{3})\\|`;
  const result = stationNames.match(pattern);

  return result ? result[1] : console.log('getStationTelecode: 未找到 "' + stationName + '" 对应的 telecode。');
}