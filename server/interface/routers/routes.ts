import { Router } from "express";
import { UserRepository } from "../../repositories";
import { UserAuthUsecase } from "../../usecases/user_auth_usecase";
import { JwtService } from "../../infrastructure/jwt_service";
import Env from "../../config/env_config";
import { PasswordService } from "../../infrastructure";
import { UserController, UserProfileController } from "../controllers";
import { UserAuthRouter } from "./auth_routes";
import { Middlewares } from "../middlewares";
import { UserRouter } from "./user_router";
import { UserProfileUsecase } from "../../usecases";

const router = Router();
const userRepo = new UserRepository();
const env = new Env();
const jwtService = new JwtService(env);
const passwordService = new PasswordService(env);
const auth_middlewares = new Middlewares(jwtService, userRepo);
const userAuthUsecase = new UserAuthUsecase(
  userRepo,
  passwordService,
  env,
  jwtService
);

const userProfileUsecase = new UserProfileUsecase(userRepo, passwordService);

const userAuthControllr = new UserController(userAuthUsecase);
const userProfileController = new UserProfileController(userProfileUsecase);
const authRouter = new UserAuthRouter(userAuthControllr);
const userRouter = new UserRouter(userProfileController);

router.use(authRouter.getRouter());
router.use(auth_middlewares.authMiddleware.bind(auth_middlewares));
router.use(userRouter.getRouter());

export default router;
