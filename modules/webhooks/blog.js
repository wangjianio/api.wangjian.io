const cp = require('child_process');
const { log } = require('../../utils');

function update(req, res) {
  console.log(req.body);

  const output = cp.execSync('cd ../blog/; ls', { encoding: 'utf-8' });
  log('webhooks', { output, req: req.body });
  res.send();
}

module.exports = {
  update,
}