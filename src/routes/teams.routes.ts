import { FastifyInstance } from "fastify";

import {
  getTeamHandler,
  createTeamHandler,
} from "../controllers/team.controller";
import { teampaths } from "../utils/paths";

const teamRoutes = (
  server: FastifyInstance,
  options: any,
  done: () => void
) => {
  server.get(teampaths.FETCH_TEAM_BY_ID, getTeamHandler);
  server.post(teampaths.DEFAULT_PATH, createTeamHandler);
  done();
};

export default teamRoutes;
