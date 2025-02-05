module.exports = {
  apps: [
    {
      name: 'errum-core-api',
      script: 'dist/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      time: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
