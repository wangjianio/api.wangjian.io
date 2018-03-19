const cp = require('child_process');
const { log } = require('../../utils');

function update(req, res) {
  console.log(req.headers);

  const output = cp.execSync('cd ../blog/; ls', { encoding: 'utf-8' });
  log('webhooks', { output, req: req.headers });
  res.send();
}

module.exports = {
  update,
}