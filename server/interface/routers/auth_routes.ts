import { Router, Request, Response } from "express";
import { UserController } from "../controllers";

export class UserAuthRouter {
  private router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.post(
      "/register",
      this.userController.register.bind(this.userController)
    );

    this.router.post(
      "/login",
      this.userController.login.bind(this.userController)
    );

    this.router.patch(
      "/refresh",
      this.userController.refreshToken.bind(this.userController)
    );

    this.router.patch(
      "/logout",
      this.userController.logout.bind(this.userController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
