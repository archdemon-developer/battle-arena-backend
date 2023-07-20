import { FastifyInstance } from "fastify";
import { build } from "./app";

const start = async () => {
  const server: FastifyInstance = build({
    logger: true,
    ignoreTrailingSlash: true,
  });
  const port: number = parseInt(process.env.PORT || "5000");
  server.listen({ port: port }, (error, address) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.log(`Server listening on ${address}`);
  });
};

start();
