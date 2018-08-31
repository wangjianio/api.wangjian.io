module.exports = {
  apps: [{
    name: 'api',
    script: 'index.js',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
    // watch: true,
    // watch_options: {
      // awaitWriteFinish: true,
    // },
    // ignore_watch: [
    //   'node_modules/',
    //   'logs/',
    //   '.DS_Store'
    // ],
  }],

  deploy: {
    production: {
      key: '~/.ssh/qcloud',
      user: 'root',
      host: '118.25.91.225',
      ref: 'origin/master',
      repo: 'https://github.com/wangjianio/api.wangjian.io.git',
      path: '/etc/node/api.wangjian.io',
      // 'pre-setup': '',
      // "post-setup": '',
      // 'pre-deploy': '',
      // 'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 restart ecosystem.config.js --env production',
    }
  }
};
