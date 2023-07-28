import { FastifyReply, FastifyRequest } from "fastify";
import { TeamRequest } from "../models/request.model";
import { ErrorResponse, TeamResponse } from "../models/response.model";
import { TeamService } from "../services/teams.service";
import { GetByIdParams } from "../models/request.params";
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
    const teamResponse: TeamResponse = await this.teamService.createTeam(
      request.body
    );
    reply.code(201).send(teamResponse);
  };

  getTeamHandler = async (
    request: FastifyRequest<{ Params: GetByIdParams }>,
    reply: FastifyReply
  ) => {
    if (request.params) {
      const teamResponse: TeamResponse = await this.teamService.findTeamById(
        request.params.id
      );
      reply.code(200).send(teamResponse);
    }
  };
}

export default TeamController;
