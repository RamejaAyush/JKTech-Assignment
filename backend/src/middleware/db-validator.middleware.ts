import logger from "../utils/logger";
import prisma from "../utils/prisma";

export const validateDBConnection = async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Successfully connected to the database");
  } catch (error) {
    logger.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
};
