import { Router } from "express";
import { UserRepository } from "../../repositories";
import { UserAuthUsecase } from "../../usecases/user_auth_usecase";
import { JwtService } from "../../infrastructure/jwt_service";
import Env from "../../config/env_config";
import { PasswordService } from "../../infrastructure";
import { UserController } from "../controllers";
import { UserAuthRouter } from "./login_routes";

const router = Router();
const userRepo = new UserRepository();
const env = new Env();
const jwtService = new JwtService(env);
const passwordService = new PasswordService(env);
const userAuthUsecase = new UserAuthUsecase(
  userRepo,
  passwordService,
  env,
  jwtService
);

const userAuthControllr = new UserController(userAuthUsecase);
const userRouter = new UserAuthRouter(userAuthControllr);

router.use(userRouter.getRouter());

export default router;
