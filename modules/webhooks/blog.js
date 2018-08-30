const config = require('../../../config.json');
const cp = require('child_process');
const { log } = require('../../utils');

function update(req, res) {
  const { route } = req;
  const { s } = req.query;

  if (s === config.github.secret) {
    const output = cp.execSync('cd ../blog/; git pull', { encoding: 'utf-8' });
    log('webhooks', { path: route.path, output });

    res.send(JSON.stringify({
      statusCode: 0,
      message: 'success',
    }));
  } else {
    res.send(JSON.stringify({
      statusCode: 40,
      message: 'invalid secret',
    }));
  }
}

module.exports = {
  update,
}