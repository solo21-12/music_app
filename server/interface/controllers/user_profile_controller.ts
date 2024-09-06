import {
  BadRequestError,
  ErrorResponse,
  UpdateUserRequest,
  UserResponse,
} from "../../domain/dtos";
import { PasswordService } from "../../infrastructure";
import { UserProfileUsecase } from "../../usecases";

export class UserProfileController {
  constructor(
    private userProfileUsecase: UserProfileUsecase,
  ) {}



  async getUserProfile(id: string): Promise<UserResponse | ErrorResponse> {
    return await this.userProfileUsecase.getUserProfileById(id);
  }

  async updateUserProfile(
    id: string,
    user: UpdateUserRequest
  ): Promise<UserResponse | ErrorResponse> {
    
    return await this.userProfileUsecase.updateUserProfile(user, id);
  }

  async deleteUserProfile(id: string): Promise<ErrorResponse | null> {
    return await this.userProfileUsecase.deleteUserProfile(id);
  }
}
