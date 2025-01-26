import logger from "./logger";

export const validateEnv = () => {
  logger.info("Validating environment variables...");
  if (!process.env.PORT) {
    throw new Error("PORT is not set");
  }
};
