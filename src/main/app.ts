import fastify, {
  FastifyBaseLogger,
  FastifyHttpOptions,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawServerDefault,
} from "fastify";

import { prefixes } from "../constants/paths.config";
import { container } from "../containers/ioc.container";
import { Routes } from "../routes/routes.interface";
import DbStartup from "../start/run.dbscripts";
import GlobalErrorHandler from "../errors/global.error.handler";
import { BattleArenaError } from "../errors/battlearena.error";
import { ErrorCodes, ErrorMessages } from "../constants/error.codes";
import GenericUtils from "../utils/genric.utils";

class AppConfig {
  build = (
    options: FastifyHttpOptions<RawServerDefault, FastifyBaseLogger>
  ) => {
    const app: FastifyInstance = fastify(options);
    app.addHook(
      "onReady",
      container.resolve<DbStartup>("dbStartup").runDbScripts
    );
    app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
      container
        .resolve<GlobalErrorHandler>("globalErrorHandler")
        .handleNotFoundError(
          new BattleArenaError(
            ErrorCodes.BA_NOT_FOUND,
            GenericUtils.formatString(
              ErrorMessages.BA_NOT_FOUND,
              request.raw.url
            )
          ),
          reply
        );
    });
    app.setErrorHandler(
      (error: Error, request: FastifyRequest, reply: FastifyReply) =>
        container
          .resolve<GlobalErrorHandler>("globalErrorHandler")
          .resolve(error, reply)
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
