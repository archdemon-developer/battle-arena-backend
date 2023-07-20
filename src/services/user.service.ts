import { UserRequest } from "../models/request.model";
import pool from "../config/postgres.config";
import { Client, PoolClient, QueryResult } from "pg";
import { FIND_USER_BY_ID, INSERT_USER } from "../utils/queries";
import { ErrorResponse, UserResponse } from "../models/response.model";

export const createUser = async (
  userData: UserRequest
): Promise<UserResponse | ErrorResponse> => {
  const postgresClient: PoolClient = await pool.connect();
  try {
    const queryResult: QueryResult = await pool.query(INSERT_USER, [
      userData.email,
      userData.username,
    ]);

    const userResponse: UserResponse = queryResult.rows[0];
    return userResponse;
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
  } finally {
    postgresClient.release();
  }
};

export const findUserById = async (
  id: string
): Promise<UserResponse | ErrorResponse> => {
  const postgresClient: PoolClient = await pool.connect();
  try {
    const queryResult: QueryResult = await pool.query(FIND_USER_BY_ID, [id]);

    if (queryResult.rowCount < 1) {
      let errorResponse: ErrorResponse = {
        errorCode: 101,
        errorMessage: `User does not exist`,
      };
      return errorResponse;
    }

    const userResponse: UserResponse = queryResult.rows[0];
    return userResponse;
  } catch (error: unknown) {
    let errorResponse: ErrorResponse = {
      errorCode: 102,
      errorMessage: `Unknown error occoured`,
    };

    if (error instanceof Error) {
      errorResponse = {
        ...errorResponse,
        errorMessage: `Error finding user : ${error.message}`,
      };
    }
    return errorResponse;
  } finally {
    postgresClient.release();
  }
};
