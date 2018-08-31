function cat(req, res) {

  res.send(JSON.stringify({
    statusCode: 0,
    message: 'success',
  }));
}

module.exports = cat;