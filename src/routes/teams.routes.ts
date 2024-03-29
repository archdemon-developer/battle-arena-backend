import { FastifyInstance } from "fastify";
import { teampaths } from "../constants/paths.config";
import { Routes } from "./routes.interface";
import { container } from "../containers/ioc.container";
import TeamController from "../controllers/team.controller";
import { TeamSchema } from "../validation/team.schema";

class TeamRoutes implements Routes {
  configure = (server: FastifyInstance, options: any, done: () => void) => {
    server.get(
      teampaths.FETCH_TEAM_BY_ID,
      container.resolve<TeamController>("teamController").getTeamHandler
    );
    server.post(
      teampaths.DEFAULT_PATH,
      { schema: { body: TeamSchema } },
      container.resolve<TeamController>("teamController").createTeamHandler
    );
    done();
  };
}

export default TeamRoutes;
