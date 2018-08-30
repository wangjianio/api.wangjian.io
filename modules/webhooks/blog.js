const config = require('../../../config.json');
const cp = require('child_process');
const { log } = require('../../utils');

function update(req, res) {
  console.log('update');
  const { s } = req.query;
  console.log('s:', s);
  console.log('config:', config.github.secret);
  
  if (s === config.github.secret) {
    console.log('===')
    const output = cp.execSync('cd ../blog/; git pull', { encoding: 'utf-8' });
    console.log(output)
    log('webhooks', { output });
  }

  res.send();
}

module.exports = {
  update,
}