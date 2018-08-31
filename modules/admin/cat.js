function cat(req, res) {

  console.log('recieve cat');

  res.send(JSON.stringify({
    statusCode: 0,
    message: 'success',
  }));
}

module.exports = cat;