import { UserRequest } from "../models/request.model";
import { db } from "../config/postgres.config";
import { QueryResult } from "pg";
import { ErrorResponse, UserResponse } from "../models/response.model";
import { ITask } from "pg-promise";
import QueryResolver from "../containers/query.container";
import { container } from "../containers/ioc.container";

export interface UserService {
  createUser: (userData: UserRequest) => Promise<UserResponse | ErrorResponse>;
  findUserById: (id: string) => Promise<UserResponse | ErrorResponse>;
}

class UserServiceImpl implements UserService {
  private queryResolver: QueryResolver;

  constructor() {
    this.queryResolver = container.resolve<QueryResolver>("queryResolver");
  }

  createUser = async (
    userData: UserRequest
  ): Promise<UserResponse | ErrorResponse> => {
    try {
      const userResponse: UserResponse = await db.tx(
        async (transaction: ITask<{}>) => {
          const { query, parameters } = this.queryResolver.resolve(
            "insertUser",
            { email: userData.email, username: userData.username }
          );
          return await transaction.one(query, parameters);
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

  findUserById = async (id: string): Promise<UserResponse | ErrorResponse> => {
    try {
      const userResponse: UserResponse = await db.tx(
        async (transaction: ITask<{}>) => {
          const { query, parameters } = this.queryResolver.resolve(
            "findUserById",
            { id: id }
          );
          return await transaction.one(query, parameters);
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
}

export default UserServiceImpl;
