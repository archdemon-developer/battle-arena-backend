import fastify, {
  FastifyBaseLogger,
  FastifyHttpOptions,
  FastifyInstance,
  RawServerDefault,
} from "fastify";

import { prefixes } from "../config/paths.config";
import { container } from "../containers/ioc.container";
import { Routes } from "../routes/routes.interface";
import DbStartup from "../start/run.dbscripts";

class AppConfig {
  build = (
    options: FastifyHttpOptions<RawServerDefault, FastifyBaseLogger>
  ) => {
    const app: FastifyInstance = fastify(options);
    app.addHook(
      "onReady",
      container.resolve<DbStartup>("dbStartup").runDbScripts
    );
    app.register(container.resolve<Routes>("userRoutes").configure, {
      prefix: prefixes.USER_PREFIX,
    });
    app.register(container.resolve<Routes>("teamRoutes").configure, {
      prefix: prefixes.TEAM_PREFIX,
    });

    return app;
  };
}

export default AppConfig;
