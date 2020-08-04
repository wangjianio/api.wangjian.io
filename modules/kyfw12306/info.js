const moment = require('moment');

const mongo = require('../../utils/mongo');


module.exports = (request, response) => {
  const info = {
    latest_version: "3.2",
    url: "https://www.icloud.com/shortcuts/2edc41bfe0784a84be23aab4dc747ed8",
    update: "2020-08-04"
  }

  response.send(JSON.stringify(info));

  const collection = mongo.db.db(`kyfw12306_${process.env.NODE_ENV}`).collection('info_log');
  const { query } = request;
  collection.insertOne({
    ...query,
    datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
}