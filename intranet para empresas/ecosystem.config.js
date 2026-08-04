module.exports = {
  apps: [
    {
      name: "infranet-backend",
      script: "npm",
      args: "run dev",
      cwd: "/home/intranetbbr/neon-flow-intranet-main/backend",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "infranet-frontend",
      script: "npm",
      args: "run dev",
      cwd: "/home/intranetbbr/neon-flow-intranet-main/frontend",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
