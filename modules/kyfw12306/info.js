const moment = require('moment');

const mongo = require('../../utils/mongo');


module.exports = (request, response) => {
  const info = {
    latest_version: "3.1",
    url: "https://www.icloud.com/shortcuts/a4626693baca46e786095ecfe4f001ab",
    update: "2018-11-19"
  }

  response.send(JSON.stringify(info));

  const collection = mongo.db.db(`kyfw12306_${process.env.NODE_ENV}`).collection('info_log');
  const { query } = request;
  collection.insertOne({
    ...query,
    datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
}