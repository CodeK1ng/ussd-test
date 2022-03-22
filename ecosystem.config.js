module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'root',
      host : '41.175.8.68',
      ref  : 'origin/main',
      repo : 'https://github.com/CodeK1ng/ussd-test.git',
      path : '/var/www/html',
      "post-deploy" : "npm install"
    }
  }
};
