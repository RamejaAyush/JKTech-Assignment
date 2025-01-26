import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf((info: winston.Logform.TransformableInfo) => {
  const args = info[Symbol.for("splat")] || [];
  const message = [info.message]
    .concat(args as any[])
    .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
    .join(" ");
  return `${info.timestamp} [${info.level}]: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
