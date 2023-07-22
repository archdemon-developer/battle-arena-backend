import { FastifyInstance } from "fastify";
import AppConfig from "./app";
import { container } from "../containers/ioc.container";

class Server {
  start = async () => {
    const server: FastifyInstance = container
      .resolve<AppConfig>("appConfig")
      .build({
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
}
export default Server;
