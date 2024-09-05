import { StatusCodes } from "http-status-codes";

export interface ErrorResponse {
  message: string;
  status: number;
}

export const NotFoundError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.NOT_FOUND,
});
export const InternalServerError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.INTERNAL_SERVER_ERROR,
});

export const BadRequestError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.BAD_REQUEST,
});

export const UnauthorizedError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.UNAUTHORIZED,
});

export const ForbiddenError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.FORBIDDEN,
});

export const ConflictError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.CONFLICT,
});

export const UnprocessableEntityError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.UNPROCESSABLE_ENTITY,
});

export const ValidationError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.UNPROCESSABLE_ENTITY,
});

export const InvalidCredentialsError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.UNAUTHORIZED,
});

export const UserExistsError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.CONFLICT,
});

export const UserNotFoundError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.NOT_FOUND,
});

export const SessionNotFoundError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.NOT_FOUND,
});

export const SessionExpiredError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.UNAUTHORIZED,
});

export const SessionInvalidError = (msg: string): ErrorResponse => ({
  message: msg,
  status: StatusCodes.UNAUTHORIZED,
});
