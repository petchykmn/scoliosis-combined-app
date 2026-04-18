const path = require('path')

module.exports = {
  apps: [
    {
      name: 'scoliosis',
      script: path.join(__dirname, 'server.cjs'),
      cwd: __dirname,
      env: {
        PORT: 5173,
      },
    },
  ],
}