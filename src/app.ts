import fastify, {
  FastifyBaseLogger,
  FastifyHttpOptions,
  FastifyInstance,
  RawServerDefault,
} from "fastify";

import userRoutes from "./routes/users.routes";
import teamRoutes from "./routes/teams.routes";
import { prefixes } from "./utils/paths";
import transactionHook from "./hooks/transaction.hook";

const build = (
  options: FastifyHttpOptions<RawServerDefault, FastifyBaseLogger>
) => {
  const app: FastifyInstance = fastify(options);

  app.register(transactionHook);

  app.register(userRoutes, { prefix: prefixes.USER_PREFIX });
  app.register(teamRoutes, { prefix: prefixes.TEAM_PREFIX });

  return app;
};

export { build };
