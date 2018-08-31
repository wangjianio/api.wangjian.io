const kyfw12306 = require('./kyfw12306');
const webhooks = require('./webhooks');
const admin = require('./admin');

module.exports = app => {
  app.get('/12306', (req, res) => {
    kyfw12306.query(req, res);
    kyfw12306.log(req);
  });

  app.get('/12306/info', (req, res) => {
    kyfw12306.info(req, res);
    kyfw12306.log(req);
  });

  app.post('/webhooks/blog/update', (req, res) => {
    webhooks.blog.update(req, res);
  });

  app.post('/webhooks/git/pull', (req, res) => {
    webhooks.git.pull(req, res);
  });

  app.get('/admin/cat', (req, res) => {
    admin.cat(req, res);
  });
}