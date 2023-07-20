import { UserRequest } from "../models/request.model";
import { db } from "../config/postgres.config";
import { QueryResult } from "pg";
import { FIND_USER_BY_ID, INSERT_USER } from "../utils/queries";
import { ErrorResponse, UserResponse } from "../models/response.model";
import { ITask } from "pg-promise";

export const createUser = async (
  userData: UserRequest
): Promise<UserResponse | ErrorResponse> => {
  try {
    const userResponse: UserResponse = await db.tx(
      async (transaction: ITask<{}>) => {
        return await transaction.one(INSERT_USER, [
          userData.email,
          userData.username,
        ]);
      }
    );

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
  }
};

export const findUserById = async (
  id: string
): Promise<UserResponse | ErrorResponse> => {
  try {
    const userResponse: UserResponse = await db.tx(
      async (transaction: ITask<{}>) => {
        return await transaction.one(FIND_USER_BY_ID, [id]);
      }
    );
    if (userResponse === null) {
      let errorResponse: ErrorResponse = {
        errorCode: 101,
        errorMessage: `User does not exist`,
      };
      return errorResponse;
    }

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
  }
};
