module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'serve',
      args: '-s dist -l 5173',
      env: {
        PM2_SERVE_PATH: './dist',
        PM2_SERVE_PORT: 5173,
        PM2_SERVE_SPA: 'true',
      },
    },
  ],
}
