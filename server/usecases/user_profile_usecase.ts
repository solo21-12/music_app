import {
  ErrorResponse,
  NotFoundError,
  UpdateUserRequest,
  UserResponse,
} from "../domain/dtos";
import { UserRepository } from "../repositories";

export class UserProfile {
  constructor(private userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async getUserProfileByEmail(email: string) {
    return await this.userRepo.findByEmail(email);
  }

  async updateUserProfile(
    user: UpdateUserRequest,
    id: string
  ): Promise<UserResponse | ErrorResponse> {
    const existUser = this.userRepo.findById(id);
    if (!existUser && (existUser as ErrorResponse).status) {
      return NotFoundError("User not found");
    }

    return await this.userRepo.update(id, user);
  }

  async deleteUserProfile(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user && (user as ErrorResponse).status) {
      return NotFoundError("User not found");
    }

    return await this.userRepo.delete(id);
  }

  async getUserProfileById(id: string) {
    return await this.userRepo.findById(id);
  }
}
