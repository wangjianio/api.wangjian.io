const jsonfile = require('jsonfile');
const file = './database/local.json';

function get(key) {
  const data = jsonfile.readFileSync(file);

  if (key === undefined) {
    return data;
  } else {
    return data[key];
  }
}

function set(obj = {}) {
  const data = obj;

  jsonfile.writeFileSync(file, data, { spaces: 2 });
}

module.exports = {
  get,
  set,
}

