module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npx',
      args: 'serve -s dist --listen tcp://0.0.0.0:5173',
      interpreter: 'none',
    },
  ],
}