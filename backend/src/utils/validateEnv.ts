import logger from "./logger";

export const validateEnv = (): void => {
  logger.info("Validating environment variables...");

  const requiredVars = [
    "PORT",
    "AUTH_CLIENT_ID",
    "AUTH_CLIENT_SECRET",
    "NODE_ENV",
    "DATABASE_URL",
    "JWT_SECRET",
  ];

  let hasErrors = false;

  for (const key of requiredVars) {
    const value = process.env[key];

    if (!value) {
      logger.error(`❌ ENV Missing: ${key} is not set.`);
      hasErrors = true;
    } else {
      logger.info(`✅ ${key} is present`);
    }
  }

  if (hasErrors) {
    throw new Error(
      "One or more required environment variables are missing. See logs above."
    );
  }

  logger.info("All required environment variables are set!");
};
