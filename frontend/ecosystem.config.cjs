module.exports = {
  apps: [
    {
      name: 'scoliosis-AI-analyzer',
      script: 'server.cjs',
      env: {
        PORT: 5173,
      },
    },
  ],
}
