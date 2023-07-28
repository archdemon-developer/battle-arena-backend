import { db } from "../config/postgres.config";
import { TeamRequest } from "../models/request.model";
import { ErrorResponse, TeamResponse } from "../models/response.model";
import { ITask } from "pg-promise";
import QueryResolver from "../containers/query.container";
import { container } from "../containers/ioc.container";
import { BattleArenaError } from "../errors/battlearena.error";
import { ErrorCodes, ErrorMessages } from "../constants/error.codes";
import GenericUtils from "../utils/genric.utils";

export interface TeamService {
  createTeam: (teamData: TeamRequest) => Promise<TeamResponse>;
  findTeamById: (id: string) => Promise<TeamResponse>;
}

class TeamServiceImpl implements TeamService {
  private queryResolver: QueryResolver;

  constructor() {
    this.queryResolver = container.resolve<QueryResolver>("queryResolver");
  }

  public createTeam = async (teamData: TeamRequest): Promise<TeamResponse> => {
    try {
      const teamResponse: TeamResponse = await db.tx(
        async (transaction: ITask<{}>) => {
          const { query, parameters } = this.queryResolver.resolve(
            "insertTeam",
            {
              email: teamData.email,
              teamname: teamData.teamname,
            }
          );
          return await transaction.one(query, parameters);
        }
      );

      return teamResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BattleArenaError(
          ErrorCodes.BA_INTERNAL_SERVER_ERROR,
          ErrorMessages.BA_INTERNAL_SERVER_ERROR
        );
      }
      throw error;
    }
  };

  public findTeamById = async (id: string): Promise<TeamResponse> => {
    try {
      const teamResponse: TeamResponse = await db.tx(
        async (transaction: ITask<{}>) => {
          const { query, parameters } = this.queryResolver.resolve(
            "findTeamById",
            { id: id }
          );
          return transaction.one(query, parameters);
        }
      );

      if (teamResponse === null) {
        throw new BattleArenaError(
          ErrorCodes.BA_BAD_REQUEST,
          GenericUtils.formatString(ErrorMessages.BA_BAD_REQUEST, id)
        );
      }

      return teamResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BattleArenaError(
          ErrorCodes.BA_INTERNAL_SERVER_ERROR,
          ErrorMessages.BA_INTERNAL_SERVER_ERROR
        );
      }
      throw error;
    }
  };
}

export default TeamServiceImpl;
