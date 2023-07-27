import { FastifyReply, FastifyRequest } from "fastify";
import { ErrorObject, ValidationError } from "ajv";
import { BattleArenaError } from "./battlearena.error";
import { StatusCodes } from "../constants/status.codes";
import { ErrorCodes, ErrorMessages } from "../constants/error.codes";
import GenericUtils from "../utils/genric.utils";

class GlobalErrorHandler {
  public handleNotFoundError(error: BattleArenaError, reply: FastifyReply) {
    reply.status(StatusCodes.STATUS_NOT_FOUND).send(error);
  }

  public handleBadRequestError(error: BattleArenaError, reply: FastifyReply) {
    reply.status(StatusCodes.STATUS_BAD_REQUEST).send(error);
  }

  public resolve(error: Error, reply: FastifyReply) {
    if (error instanceof BattleArenaError) {
      this.resolveBattleArenaError(error, reply);
    } else if (error instanceof ValidationError) {
      const validationError: ErrorObject<
        string,
        Record<string, any>,
        unknown
      >[] = (error as any).errors;
      const badRequestBattleArenaError: BattleArenaError =
        this.buildBadRequestBattleArenaError(
          ErrorCodes.BA_BAD_REQUEST,
          ErrorMessages.BA_BAD_REQUEST,
          validationError
        );
      this.resolveBattleArenaError(badRequestBattleArenaError, reply);
    } else {
      this.handleNoHandlerFoundError(reply);
    }
  }

  public resolveBattleArenaError(error: BattleArenaError, reply: FastifyReply) {
    if (error.getStatusCode() === ErrorCodes.BA_NOT_FOUND) {
      this.handleNotFoundError(error, reply);
    } else if (error.getStatusCode() === ErrorCodes.BA_BAD_REQUEST) {
      this.handleBadRequestError(error, reply);
    } else {
      this.handleNoHandlerFoundError(reply);
    }
  }

  public handleNoHandlerFoundError(reply: FastifyReply) {
    reply
      .status(500)
      .send(
        new BattleArenaError(
          ErrorCodes.BA_INTERNAL_SERVER_ERROR,
          ErrorMessages.BA_INTERNAL_SERVER_ERROR
        )
      );
  }

  public buildBadRequestBattleArenaError(
    statusCode: number,
    message: string,
    validationError: ErrorObject<string, Record<string, any>, unknown>[]
  ) {
    return new BattleArenaError(
      statusCode,
      GenericUtils.formatString(
        message,
        `[${validationError.map((errorObj) => errorObj.message).join(",")}]`
      )
    );
  }
}

export default GlobalErrorHandler;
