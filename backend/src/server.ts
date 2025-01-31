import dotenv from "dotenv";

import app from "./app";
import logger from "./utils/logger";
import { validateEnv } from "./utils/validateEnv";
import { serverConfig } from "./config/serverConfig";
import { validateDBConnection } from "./middleware/db-validator.middleware";

dotenv.config();

const { port } = serverConfig();

validateEnv();

validateDBConnection().then(() => {
  app.listen(port, () => {
    logger.info(`Backend is running on http://localhost:${port}`);
  });
});
