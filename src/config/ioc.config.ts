import QueryResolver from "../containers/query.container";
import UserServiceImpl from "../services/user.service";
import TeamServiceImpl from "../services/teams.service";
import UserController from "../controllers/user.controller";
import TeamController from "../controllers/team.controller";
import TeamRoutes from "../routes/teams.routes";
import UserRoutes from "../routes/users.routes";
import AppConfig from "../main/app";
import Server from "../main/server";
import DbStartup from "../start/run.dbscripts";

export const Beans = {
  queryResolver: QueryResolver,
  userService: UserServiceImpl,
  teamService: TeamServiceImpl,
  userController: UserController,
  teamController: TeamController,
  teamRoutes: TeamRoutes,
  userRoutes: UserRoutes,
  appConfig: AppConfig,
  serverStartup: Server,
  dbStartup: DbStartup,
};
