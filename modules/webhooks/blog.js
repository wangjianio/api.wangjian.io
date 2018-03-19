const fs = require('fs');
const cp = require('child_process');
const { log } = require('../../utils');

function update(req, res) {
  const secret = fs.readFileSync('../github.secret', { encoding: 'utf-8' });
  const { s } = req.query;

  console.log(s, secret);

  if (s === secret) {
    const output = cp.execSync('cd ../blog/; ls', { encoding: 'utf-8' });
    log('webhooks', { output });
    console.log('success');
  }

  res.send();
}

module.exports = {
  update,
}