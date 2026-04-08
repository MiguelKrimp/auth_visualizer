const EnvironmentVars = {
  // client
  clientOrigin: process.env.CLIENT_ORIGIN as string,

  development: process.env.DEVELOPMENT === 'true',
  demoUsername: process.env.DEMO_USER_USERNAME as string,
  demoPassword: process.env.DEMO_USER_PASSWORD as string,
  jwtSecret: process.env.JWT_SECRET as string,

  // server
  hostname: process.env.HOSTNAME as string,
  port: Number(process.env.PORT),

  // db
  dbHost: process.env.DB_HOST as string,
  dbPort: Number(process.env.DB_PORT),
  dbUsername: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
};

function validateEnvironmentVars(): void {
  for (const [key, value] of Object.entries(EnvironmentVars)) {
    if (value === undefined || value === null) {
      throw new Error(`Environment variable ${key} is not set.`);
    }
  }
}

export { EnvironmentVars, validateEnvironmentVars };
