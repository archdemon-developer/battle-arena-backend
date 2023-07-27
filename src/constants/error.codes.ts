export enum ErrorCodes {
  BA_NOT_FOUND = 404,
  BA_BAD_REQUEST = 400,
  BA_INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorMessages {
  BA_NOT_FOUND = "Requested resource {} was not found",
  BA_BAD_REQUEST = "Invalid request, missing parameters: {}",
  BA_INTERNAL_SERVER_ERROR = "Internal error occoured",
}
