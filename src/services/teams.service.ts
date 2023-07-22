import { db } from "../config/postgres.config";
import { TeamRequest } from "../models/request.model";
import { ErrorResponse, TeamResponse } from "../models/response.model";
import { ITask } from "pg-promise";
import QueryResolver from "../containers/query.container";
import { container } from "../containers/ioc.container";

export interface TeamService {
  createTeam: (teamData: TeamRequest) => Promise<TeamResponse | ErrorResponse>;
  findTeamById: (id: string) => Promise<TeamResponse | ErrorResponse>;
}

class TeamServiceImpl implements TeamService {
  private queryResolver: QueryResolver;

  constructor() {
    this.queryResolver = container.resolve<QueryResolver>("queryResolver");
  }

  public createTeam = async (
    teamData: TeamRequest
  ): Promise<TeamResponse | ErrorResponse> => {
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
      let errorResponse: ErrorResponse = {
        errorCode: 100,
        errorMessage: `Unknown error occoured`,
      };

      if (error instanceof Error) {
        errorResponse = {
          ...errorResponse,
          errorMessage: `Error inserting data : ${error.message}`,
        };
      }
      return errorResponse;
    }
  };

  public findTeamById = async (
    id: string
  ): Promise<TeamResponse | ErrorResponse> => {
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
        let errorResponse: ErrorResponse = {
          errorCode: 101,
          errorMessage: `Team does not exist`,
        };
        return errorResponse;
      }

      return teamResponse;
    } catch (error: unknown) {
      let errorResponse: ErrorResponse = {
        errorCode: 102,
        errorMessage: `Unknown error occoured`,
      };

      if (error instanceof Error) {
        errorResponse = {
          ...errorResponse,
          errorMessage: `Error finding team : ${error.message}`,
        };
      }
      return errorResponse;
    }
  };
}

export default TeamServiceImpl;
