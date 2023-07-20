import { FastifyInstance } from "fastify";
import {
  createUserHandler,
  getUserHandler,
} from "../controllers/user.controller";
import { userpaths } from "../utils/paths";

const userRoutes = (
  server: FastifyInstance,
  options: any,
  done: () => void
) => {
  server.post(userpaths.DEFAULT_PATH, createUserHandler);
  server.get(userpaths.FETCH_USER_BY_ID, getUserHandler);
  done();
};

export default userRoutes;
