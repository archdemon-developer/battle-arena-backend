import { FastifyReply, FastifyRequest } from "fastify";
import { TeamRequest } from "../models/request.model";
import { ErrorResponse, TeamResponse } from "../models/response.model";
import { TeamService } from "../services/teams.service";
import { TeamParams } from "../models/request.params";
import { container } from "../containers/ioc.container";

class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = container.resolve<TeamService>("teamService");
  }

  createTeamHandler = async (
    request: FastifyRequest<{ Body: TeamRequest }>,
    reply: FastifyReply
  ) => {
    const teamResponse: TeamResponse | ErrorResponse =
      await this.teamService.createTeam(request.body);

    if ("errorCode" in teamResponse) {
      reply.code(500).send(teamResponse);
    } else {
      reply.code(201).send(teamResponse);
    }
  };

  getTeamHandler = async (
    request: FastifyRequest<TeamParams>,
    reply: FastifyReply
  ) => {
    if (request.params) {
      const teamResponse: TeamResponse | ErrorResponse =
        await this.teamService.findTeamById(request.params.id);

      if ("errorCode" in teamResponse) {
        reply.code(500).send(teamResponse);
      } else {
        reply.code(200).send(teamResponse);
      }
    } else {
      reply.code(400).send({ message: `invalid user id` });
    }
  };
}

export default TeamController;
