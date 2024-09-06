import { InternalServerError } from "../../domain/dtos/error_response";
import { Router, Request, Response } from "express";
import { UserController } from "../controllers";
import { StatusCodes } from "http-status-codes";
import {
  ErrorResponse,
  UserCreateRequest,
  UserResponse,
} from "../../domain/dtos";

export class UserAuthRouter {
  private router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.post("/register", async (req: Request, res: Response) => {
      try {
        const body: UserCreateRequest = req.body;
        const createRes = await this.userController.register(body);

        if (createRes && !(createRes as ErrorResponse).status) {
          res.status(StatusCodes.CREATED).json(createRes as UserResponse);
        } else {
          res
            .status(
              (createRes as ErrorResponse).status ||
                StatusCodes.INTERNAL_SERVER_ERROR
            )
            .json({
              message:
                (createRes as ErrorResponse).message || "An error occurred",
            });
        }
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "An unexpected error occurred",
        });
      }
    });

    this.router.post("/login", async (req: Request, res: Response) => {
      try {
        const body: UserCreateRequest = req.body;
        const loginRes = await this.userController.login(body);

        if (loginRes && !(loginRes as ErrorResponse).status) {
          res.status(StatusCodes.OK).json(loginRes);
        } else {
          res
            .status(
              (loginRes as ErrorResponse).status ||
                StatusCodes.INTERNAL_SERVER_ERROR
            )
            .json({
              message:
                (loginRes as ErrorResponse).message || "An error occurred",
            });
        }
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "An unexpected error occurred" + err,
        });
      }
    });

    this.router.patch("/refresh", async (req: Request, res: Response) => {
      try {
        const refreshToken = req.headers["authorization"]?.split(" ")[1];
        if (!refreshToken) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "Refresh token is required",
          });
          return;
        }
        const refreshRes = await this.userController.refreshToken({
          refreshToken,
        });

        if (refreshRes && !(refreshRes as ErrorResponse).status) {
          res.status(StatusCodes.OK).json({
            accessToken: refreshRes as string,
          });
        } else {
          res
            .status(
              (refreshRes as ErrorResponse).status ||
                StatusCodes.INTERNAL_SERVER_ERROR
            )
            .json({
              message:
                (refreshRes as ErrorResponse).message || "An error occurred",
            });
        }
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "An unexpected error occurred",
        });
      }
    });

    this.router.patch("/logout", async (req: Request, res: Response) => {
      try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "Token is required",
          });
          return;
        }
        const logoutRes = await this.userController.logout({
          refreshToken: token,
        });

        if (logoutRes && (logoutRes as ErrorResponse).status) {
          res
            .status((logoutRes as ErrorResponse).status)
            .json({ message: (logoutRes as ErrorResponse).message });
        } else {
          res.status(StatusCodes.NO_CONTENT).json();
        }
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "An unexpected error occurred",
        });
      }
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}
