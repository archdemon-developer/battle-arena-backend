import { Client, PoolClient, QueryResult } from "pg";
import pool from "../config/postgres.config";
import { FIND_TEAM_BY_ID, INSERT_TEAM } from "../utils/queries";
import { TeamRequest } from "../models/request.model";
import { ErrorResponse, TeamResponse } from "../models/response.model";
import { FastifyRequest } from "fastify";

export const createTeam = async (
  transaction: PoolClient,
  teamData: TeamRequest
) => {
  const client: PoolClient = transaction; // Access the pg Client from the request object

  if (!client) {
    throw new Error("Transaction not available in the request.");
  }

  try {
    const queryResult: QueryResult = await pool.query(INSERT_TEAM, [
      teamData.email,
      teamData.teamname,
    ]);

    const teamResponse: TeamResponse = queryResult.rows[0];
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
  const postgresClient: PoolClient = await pool.connect();
  try {
    const queryResult: QueryResult = await pool.query(FIND_TEAM_BY_ID, [id]);

    if (queryResult.rowCount < 1) {
      let errorResponse: ErrorResponse = {
        errorCode: 101,
        errorMessage: `Team does not exist`,
      };
      return errorResponse;
    }

    const teamResponse: TeamResponse = queryResult.rows[0];
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
  } finally {
    postgresClient.release();
  }
};
