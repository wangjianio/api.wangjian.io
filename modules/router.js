const kyfw12306 = require('./kyfw12306');
const webhooks = require('./webhooks');
const admin = require('./admin');
const statistics = require('./statistics');

module.exports = app => {
  app.get('/12306', (req, res) => {
    kyfw12306.query(req, res);
    kyfw12306.log(req);
  });

  app.get('/12306/info', (req, res) => {
    kyfw12306.info(req, res);
    kyfw12306.log(req);
  });

  app.get('/12306/list', (req, res) => {
    kyfw12306.list(req, res);
    kyfw12306.log(req);
  });

  app.get('/12306/update', (req, res) => {
    kyfw12306.update(req, res);
  });

  app.post('/webhooks/blog/update', (req, res) => {
    webhooks.blog.update(req, res);
  });

  // 弃用
  // app.post('/webhooks/git/pull', (req, res) => {
  //   webhooks.git.pull(req, res);
  // });

  app.get('/admin/cat', (req, res) => {
    admin.cat(req, res);
  });

  app.get('/statistics/kyfw12306', (req, res) => {
    statistics.kyfw12306(req, res);
  });
}