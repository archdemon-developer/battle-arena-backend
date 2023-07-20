import { QueryResult } from "pg";
import { db } from "../config/postgres.config";
import { FIND_TEAM_BY_ID, INSERT_TEAM } from "../utils/queries";
import { TeamRequest } from "../models/request.model";
import { ErrorResponse, TeamResponse } from "../models/response.model";
import { ITask } from "pg-promise";

export const createTeam = async (teamData: TeamRequest) => {
  try {
    const teamResponse: TeamResponse = await db.tx(
      async (transaction: ITask<{}>) => {
        return await transaction.one(INSERT_TEAM, [
          teamData.email,
          teamData.teamname,
        ]);
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

export const findTeamById = async (id: string) => {
  try {
    const teamResponse: TeamResponse = await db.tx(
      async (transaction: ITask<{}>) => {
        return transaction.one(FIND_TEAM_BY_ID, [id]);
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
