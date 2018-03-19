const fs = require('fs');
const cp = require('child_process');
const { log } = require('../../utils');

function update(req, res) {
  const secret = fs.readFileSync('../github.secret', { encoding: 'utf-8' });
  const signature = req.headers['x-hub-signature'];

  console.log(secret, signature);
  if (signature === secret) {
    const output = cp.execSync('cd ../blog/; ls', { encoding: 'utf-8' });
    log('webhooks', { output, req: req.headers });
    console.log('success');
  }

  res.send();
}

module.exports = {
  update,
}