import { FastifyReply, FastifyRequest } from "fastify";
import { GetByIdParams } from "../models/request.params";
import { UserRequest } from "../models/request.model";
import { ErrorResponse, UserResponse } from "../models/response.model";
import { UserService } from "../services/user.service";
import { container } from "../containers/ioc.container";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = container.resolve<UserService>("userService");
  }

  createUserHandler = async (
    request: FastifyRequest<{ Body: UserRequest }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userResponse: UserResponse = await this.userService.createUser(
      request.body
    );
    reply.code(201).send(userResponse);
  };

  getUserHandler = async (
    request: FastifyRequest<{ Params: GetByIdParams }>,
    reply: FastifyReply
  ): Promise<void> => {
    if (request.params) {
      const userResponse: UserResponse = await this.userService.findUserById(
        request.params.id
      );
      reply.code(200).send(userResponse);
    }
  };
}

export default UserController;
