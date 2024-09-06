import {
  BadRequestError,
  ErrorResponse,
  NotFoundError,
  UpdateUserRequest,
  UserResponse,
} from "../domain/dtos";
import { PasswordService } from "../infrastructure";
import { UserRepository } from "../repositories";

export class UserProfileUsecase {
  constructor(
    private userRepo: UserRepository,
    private passwordService: PasswordService
  ) {
    this.userRepo = userRepo;
  }

  private isValid(user: UpdateUserRequest): boolean {
    if (
      user.email === undefined &&
      user.password === undefined &&
      user.name === undefined
    ) {
      return false;
    }

    return true;
  }
  async updateUserProfile(
    user: UpdateUserRequest,
    id: string
  ): Promise<UserResponse | ErrorResponse> {
    const existUser = this.userRepo.findById(id);
    if (!existUser && (existUser as ErrorResponse).status) {
      return NotFoundError("User not found");
    }

    if (!this.isValid(user)) {
      return BadRequestError("At least one field must be updated");
    }

    if (user.password !== undefined) {
      const strength = await this.passwordService.checkPasswordStrength(
        user.password
      );
      if (strength) {
        return BadRequestError(strength);
      }

      user.password = await this.passwordService.hashPassword(user.password);
    }

    return await this.userRepo.update(id, user);
  }

  async deleteUserProfile(id: string): Promise<ErrorResponse | null> {
    const user = await this.userRepo.findById(id);

    if (!user && (user as ErrorResponse).status) {
      return NotFoundError("User not found");
    }

    return await this.userRepo.delete(id);
  }

  async getUserProfileById(id: string): Promise<UserResponse | ErrorResponse> {
    return await this.userRepo.findById(id);
  }
}
