import { FastifyReply, FastifyRequest } from "fastify";
import { TeamRequest } from "../models/request.model";
import { ErrorResponse, TeamResponse } from "../models/response.model";
import { createTeam, findTeamById } from "../services/teams.service";
import { TeamParams } from "../models/request.params";

const createTeamHandler = async (
  request: FastifyRequest<{ Body: TeamRequest }>,
  reply: FastifyReply
) => {
  const teamResponse: TeamResponse | ErrorResponse = await createTeam(
    request.body
  );

  if ("errorCode" in teamResponse) {
    reply.code(500).send(teamResponse);
  } else {
    reply.code(201).send(teamResponse);
  }
};

const getTeamHandler = async (
  request: FastifyRequest<TeamParams>,
  reply: FastifyReply
) => {
  if (request.params) {
    const teamResponse: TeamResponse | ErrorResponse = await findTeamById(
      request.params.id
    );

    if ("errorCode" in teamResponse) {
      reply.code(500).send(teamResponse);
    } else {
      reply.code(200).send(teamResponse);
    }
  } else {
    reply.code(400).send({ message: `invalid user id` });
  }
};

export { createTeamHandler, getTeamHandler };
