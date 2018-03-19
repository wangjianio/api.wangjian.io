const fs = require('fs');
const cp = require('child_process');
const { log } = require('../../utils');

function update(req, res) {
  const secret = fs.readFileSync('../github.secret', { encoding: 'utf-8' });
  const { s } = req.query;

  if (s === secret) {
    const output = cp.execSync('cd ../blog/; git pull', { encoding: 'utf-8' });
    log('webhooks', { output });
  }

  res.send();
}

module.exports = {
  update,
}