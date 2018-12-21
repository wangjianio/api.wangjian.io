const cp = require('child_process');
const sendMail = require('../mail/send');
const mongo = require('../../utils/mongo');

module.exports = async function (request, response) {
  const collection = mongo.db.db(`kyfw12306_${process.env.NODE_ENV}`).collection('utils');
  const { localVersion } = await collection.findOne({}) || {};

  global.axios({
    url: 'https://kyfw.12306.cn/otn/leftTicket/init',
  }).then(res => {
    if (res.status === 200) {

      const result = res.data.match(/station_name\.js\?station_version=(.*?)['"]/);
      
      if (result.length >= 2) {
        const latestVersion = result[1];

        // 版本号不同，下载文件
        if (localVersion !== latestVersion) {
          console.log('Have update');
          response.send(JSON.stringify({
            statusCode: 1,
            message: 'Have update',
          }));

          /**
           * 下载文件
           * TODO: 下载失败不执行下一步
           */
          cp.execSync(`cd modules/kyfw12306/lib; wget --no-check-certificate -a wget.log -b -O station_name.js https://kyfw.12306.cn/otn/resources/js/framework/station_name.js?station_version=${latestVersion}`, { encoding: 'utf-8' });

          // 修改数据库记录版本号
          collection.findOneAndUpdate(
            { localVersion },
            { $set: { localVersion: latestVersion } },
            { upsert: true }
          );

          // 发送邮件提醒
          sendMail('【api.wangjian.io】station_name.js 更新完成', `更新前版本号：${localVersion}\n当前版本号：${latestVersion}`);
        } else {
          console.log('Updated');
          response.send(JSON.stringify({
            statusCode: 0,
            message: 'Updated',
          }));
        }
      }
    }
  })
}




