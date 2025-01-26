export const serverConfig = (): { port: number } => ({
  port: Number(process.env.PORT) || 8080,
});
