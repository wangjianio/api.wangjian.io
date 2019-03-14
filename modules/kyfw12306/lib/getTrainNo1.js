const sendMail = require('../../mail/send');

/**
 * 获取 trainNo。
 * @param {string} date  发车日期
 * @param {string} from  出发站的 telecode
 * @param {string} to    到达站的 telecode
 * @param {string} trainCode 车次
 */
module.exports = function getTrainNo1({ date, from = 'BBB', to = 'BBB', trainCode }) {
  if (!date || !from || !to || !trainCode) {
    return console.log('getTrainNo: 缺少参数。');
  }

  let count = 0;


  return get('leftTicket/query');

  function get(c_url) {
    count++;

    if (count > 30) {
      throw {
        type: 'query',
        reason: '',
        message: 'Server buzy, please retry later.'
      };
    }

    return global.axios({
      url: 'https://kyfw.12306.cn/otn/' + c_url,
      params: {
        'leftTicketDTO.train_date': date,
        'leftTicketDTO.from_station': from,
        'leftTicketDTO.to_station': to,
        purpose_codes: 'ADULT',
      }
    }).then(response => {
      console.log(response)

      if (response.data.status) {
        const pattern = `\\|(.{12})\\|${trainCode}\\|`;
        const string = response.data.data.result.find(item => item.includes(`|${trainCode}|`));
        const result = string.match(pattern);
        if (result && result.length) {
          return result[1];
        }
      }

      return get(c_url);
    }).catch(error => {
      if (error.response && error.response.status === 302) {
        sendMail(
          `【api.wangjian.io/12306】getTrainNo1 失效`,
          JSON.stringify(error.response.data)
        );
        return get(error.response.data.c_url);
      }

      throw error;
    })
  }
}