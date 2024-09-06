import { Router, Request, Response } from "express";
import { UserController, UserProfileController } from "../controllers";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse, UpdateUserRequest } from "../../domain/dtos";
export class UserRouter {
  private router: Router;

  constructor(private userController: UserProfileController) {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/users/:id",
      this.userController.getUserProfile.bind(this.userController)
    );

    this.router.patch(
      "/users/:id",
      this.userController.updateUserProfile.bind(this.userController)
    );

    this.router.delete(
      "/users/:id",
      this.userController.deleteUserProfile.bind(this.userController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
