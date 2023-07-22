import { FastifyInstance } from "fastify";
import { userpaths } from "../config/paths.config";
import { Routes } from "./routes.interface";
import { container } from "../containers/ioc.container";
import UserController from "../controllers/user.controller";

class UserRoutes implements Routes {
  configure = (server: FastifyInstance, options: any, done: () => void) => {
    server.post(
      userpaths.DEFAULT_PATH,
      container.resolve<UserController>("userController").createUserHandler
    );
    server.get(
      userpaths.FETCH_USER_BY_ID,
      container.resolve<UserController>("userController").getUserHandler
    );
    done();
  };
}

export default UserRoutes;
