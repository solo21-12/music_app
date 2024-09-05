import {
  ErrorResponse,
  UserCreateRequest,
  UserLoginRequest,
  UserLoginResponse,
  UserResponse,
} from "../../domain/dtos";
import { UserAuthUsecase } from "../../usecases/user_auth_usecase";

export class UserController {
  constructor(private userAuthUsecase: UserAuthUsecase) {
    this.userAuthUsecase = userAuthUsecase;
  }

  async login(
    request: UserLoginRequest
  ): Promise<UserLoginResponse | ErrorResponse> {
    return await this.userAuthUsecase.login(request);
  }

  async register(
    request: UserCreateRequest
  ): Promise<UserResponse | ErrorResponse> {
    return await this.userAuthUsecase.register(request);
  }

  async refreshToken(request: {
    refreshToken: string;
  }): Promise<string | ErrorResponse> {
    return await this.userAuthUsecase.refreshAccessToken(request.refreshToken);
  }

  async logout(request: {
    refreshToken: string;
  }): Promise<ErrorResponse | null> {
    return await this.userAuthUsecase.logout(request.refreshToken);
  }
}
