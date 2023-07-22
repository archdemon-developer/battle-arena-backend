import { FastifyInstance } from "fastify";

export interface Routes {
  configure: (server: FastifyInstance, options: any, done: () => void) => void;
}
