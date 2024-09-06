import { Session } from "inspector/promises";
import Env from "../config/env_config";
import {
  ErrorResponse,
  InvalidCredentialsError,
  NotFoundError,
  UserAuth,
  UserCreateRequest,
  UserLoginRequest,
  UserLoginResponse,
  UserResponse,
} from "../domain/dtos";
import { PasswordService } from "../infrastructure";
import { JwtService } from "../infrastructure/jwt_service";
import { UserRepository } from "../repositories";

export class UserAuthUsecase {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService,
    private env: Env,
    private jwtService: JwtService
  ) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.env = env;
    this.jwtService = jwtService;
  }

  async login(
    request: UserLoginRequest
  ): Promise<UserLoginResponse | ErrorResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    if (user) {
      const isValid = await this.passwordService.comparePassword(
        request.password,
        (user as UserAuth).password
      );

      const accessToken = this.jwtService.generateToken(
        { email: (user as UserAuth).email },
        this.env.ACCESS_TOKEN_EXPIRES_IN
      );

      const refreshToken = this.jwtService.generateToken(
        { email: (user as UserAuth).email },
        this.env.REFRESH_TOKEN_EXPIRES_IN
      );

      const res: UserLoginResponse = {
        accessToken,
        refreshToken,
      };

      if (isValid) {
        const updatedUser = await this.userRepository.updateSessionToken(
          (user as UserAuth).email,
          {
            accessToken,
            refreshToken,
          }
        );

        if (updatedUser && (updatedUser as ErrorResponse).status) {
          return updatedUser;
        }

        return res;
      } else {
        return InvalidCredentialsError("Invalid credentials");
      }
    }

    return NotFoundError("User not found");
  }

  async register(
    request: UserCreateRequest
  ): Promise<UserResponse | ErrorResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    if (user && (user as ErrorResponse).status != 404) {
      return NotFoundError("User already exists");
    }

    const strength = await this.passwordService.checkPasswordStrength(
      request.password
    );
    if (strength) {
      return InvalidCredentialsError(strength);
    }

    const hashedPassword = await this.passwordService.hashPassword(
      request.password
    );

    request.password = hashedPassword;
    const newUser = await this.userRepository.create(request);

    return newUser;
  }

  async refreshAccessToken(token: string): Promise<string | ErrorResponse> {
    const payload = this.jwtService.verifyToken(token);
    if (payload) {
      const accessToken = this.jwtService.generateToken(
        { email: payload.email },
        this.env.ACCESS_TOKEN_EXPIRES_IN
      );

      const updatedUser = await this.userRepository.updateSessionToken(
        payload.email,
        {
          accessToken,
          refreshToken: token,
        }
      );

      if (updatedUser && (updatedUser as ErrorResponse).status) {
        return updatedUser;
      }

      return accessToken;
    }

    return InvalidCredentialsError("Invalid token");
  }

  async logout(token: string): Promise<ErrorResponse | null> {
    const payload = this.jwtService.verifyToken(token);
    if (payload) {
      const res = await this.userRepository.deleteSessionToken(payload.email);
      return res;
    }

    return InvalidCredentialsError("Invalid token");
  }
}
