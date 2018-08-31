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
    watch: true,
    watch_options: {
      // awaitWriteFinish: true,
    },
    ignore_watch: [
      'node_modules/',
      'logs/',
    ],
  }],

  deploy: {
    production: {
      key: '~/.ssh/qcloud',
      user: 'root',
      host: '118.25.91.225',
      ref: 'origin/master',
      repo: 'https://github.com/wangjianio/api.wangjian.io.git',
      path: '/etc/node/test',
      // 'pre-setup': "",
      // "post-setup": "",
      'pre-deploy': 'cd ~; mkdir pre-deploy; pwd > 2',
      'pre-deploy-local': 'cd ~; mkdir pre-deploy-local; pwd > 3',
      'post-deploy': 'mkdir post-deploy; pwd > 4',
    }
  }
};
