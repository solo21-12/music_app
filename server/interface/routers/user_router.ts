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
    this.router.get("/users/:id", async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        const user = await this.userController.getUserProfile(id);

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
    });

    this.router.patch("/users/:id", async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        const body: UpdateUserRequest = req.body;
        const user = await this.userController.updateUserProfile(id, body);

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
    });

    this.router.delete("/users/:id", async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        const user = await this.userController.deleteUserProfile(id);

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
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}
