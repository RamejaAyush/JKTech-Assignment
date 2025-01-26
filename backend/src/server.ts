import app from "./app";
import logger from "./utils/logger";
import { validateEnv } from "./utils/validateEnv";
import { serverConfig } from "./config/serverConfig";

import dotenv from "dotenv";

dotenv.config();

const { port } = serverConfig();

validateEnv();

app.listen(port, () => {
  logger.info(`Backend is running on http://localhost:${port}`);
});
