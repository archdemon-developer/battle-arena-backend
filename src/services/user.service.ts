import { UserRequest } from "../models/request.model";
import { db } from "../config/postgres.config";
import { QueryResult } from "pg";
import { ErrorResponse, UserResponse } from "../models/response.model";
import { ITask } from "pg-promise";
import QueryResolver from "../containers/query.container";
import { container } from "../containers/ioc.container";
import { BattleArenaError } from "../errors/battlearena.error";
import { ErrorCodes, ErrorMessages } from "../constants/error.codes";
import GenericUtils from "../utils/genric.utils";

export interface UserService {
  createUser: (userData: UserRequest) => Promise<UserResponse>;
  findUserById: (id: string) => Promise<UserResponse>;
}

class UserServiceImpl implements UserService {
  private queryResolver: QueryResolver;

  constructor() {
    this.queryResolver = container.resolve<QueryResolver>("queryResolver");
  }

  createUser = async (userData: UserRequest): Promise<UserResponse> => {
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
      if (error instanceof Error) {
        throw new BattleArenaError(
          ErrorCodes.BA_INTERNAL_SERVER_ERROR,
          ErrorMessages.BA_INTERNAL_SERVER_ERROR
        );
      }
      throw error;
    }
  };

  findUserById = async (id: string): Promise<UserResponse> => {
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
        throw new BattleArenaError(
          ErrorCodes.BA_BAD_REQUEST,
          GenericUtils.formatString(ErrorMessages.BA_BAD_REQUEST, id)
        );
      }

      return userResponse;
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

export default UserServiceImpl;
