const config = require('../../../config.json');
const cp = require('child_process');
const { log } = require('../../utils');

function update(req, res) {
  const { s } = req.query;

  if (s === config.github.secret) {
    const output = cp.execSync('cd ../blog/; git pull', { encoding: 'utf-8' });
    log('webhooks', { output });
  }

  res.send();
}

module.exports = {
  update,
}