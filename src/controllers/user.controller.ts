import { FastifyReply, FastifyRequest } from "fastify";
import { UserParams } from "../models/request.params";
import { UserRequest } from "../models/request.model";
import { ErrorResponse, UserResponse } from "../models/response.model";
import { createUser, findUserById } from "../services/user.service";

const createUserHandler = async (
  request: FastifyRequest<{ Body: UserRequest }>,
  reply: FastifyReply
): Promise<void> => {
  const userResponse: UserResponse | ErrorResponse = await createUser(
    request.body
  );

  if ("errorCode" in userResponse) {
    reply.code(500).send(userResponse);
  } else {
    reply.code(201).send(userResponse);
  }
};

const getUserHandler = async (
  request: FastifyRequest<UserParams>,
  reply: FastifyReply
): Promise<void> => {
  if (request.params) {
    const userResponse: UserResponse | ErrorResponse = await findUserById(
      request.params.id
    );

    if ("errorCode" in userResponse) {
      reply.code(500).send(userResponse);
    } else {
      reply.code(200).send(userResponse);
    }
  } else {
    reply.code(400).send({ message: `invalid user id` });
  }
};

export { createUserHandler, getUserHandler };
