import { Request, Response } from "express";
import {
  BadRequestError,
  ErrorResponse,
  UpdateUserRequest,
  UserResponse,
} from "../../domain/dtos";
import { PasswordService } from "../../infrastructure";
import { UserProfileUsecase } from "../../usecases";
import { StatusCodes } from "http-status-codes";

export class UserProfileController {
  constructor(private userProfileUsecase: UserProfileUsecase) {}

  async getUserProfile(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await this.userProfileUsecase.getUserProfileById(id);

      if (user && (user as ErrorResponse).status) {
        res
          .status((user as ErrorResponse).status)
          .json({ message: (user as ErrorResponse).message });
      } else {
        res.status(StatusCodes.OK).json(user);
      }
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "An unexpected error occurred" });
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const body: UpdateUserRequest = req.body;
      const user = await this.userProfileUsecase.updateUserProfile(body, id);

      if (user && !(user as ErrorResponse).status) {
        res.status(StatusCodes.OK).json(user);
      } else {
        res
          .status((user as ErrorResponse).status)
          .json({ message: (user as ErrorResponse).message });
      }
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "An unexpected error occurred" });
    }
  }

  async deleteUserProfile(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await this.userProfileUsecase.deleteUserProfile(id);

      if (user && (user as ErrorResponse).status) {
        res
          .status((user as ErrorResponse).status)
          .json({ message: (user as ErrorResponse).message });
      } else {
        res.status(StatusCodes.NO_CONTENT).json({ message: "User deleted" });
      }
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "An unexpected error occurred" });
    }
  }
}
