import { Router } from "express";
import { MusicRepository, UserRepository } from "../../repositories";
import { UserAuthUsecase } from "../../usecases/user_auth_usecase";
import { JwtService } from "../../infrastructure/jwt_service";
import Env from "../../config/env_config";
import {
  PasswordService,
  UploadService,
  YoutubeVideoService,
} from "../../infrastructure";
import {
  MusicController,
  UserController,
  UserProfileController,
} from "../controllers";
import { UserAuthRouter } from "./auth_routes";
import { Middlewares } from "../middlewares";
import { UserRouter } from "./user_router";
import { MusicUsecase, UserProfileUsecase } from "../../usecases";
import { MusicRouter } from "./music_routes";

const router = Router();
const userRepo = new UserRepository();
const musicRepo = new MusicRepository();
const env = new Env();
const jwtService = new JwtService(env);
const uploadService = new UploadService(env);
const ytService = new YoutubeVideoService();
const passwordService = new PasswordService(env);
const auth_middlewares = new Middlewares(jwtService, userRepo);
const userAuthUsecase = new UserAuthUsecase(
  userRepo,
  passwordService,
  env,
  jwtService
);
const musicUsecase = new MusicUsecase(musicRepo, uploadService, ytService);
const userProfileUsecase = new UserProfileUsecase(userRepo, passwordService);

const userAuthControllr = new UserController(userAuthUsecase);
const userProfileController = new UserProfileController(userProfileUsecase);
const musicController = new MusicController(musicUsecase);

const authRouter = new UserAuthRouter(userAuthControllr);
const userRouter = new UserRouter(userProfileController);
const musicRouter = new MusicRouter(musicController);

router.use(authRouter.getRouter());
router.use(auth_middlewares.authMiddleware.bind(auth_middlewares));
router.use(userRouter.getRouter());
router.use(musicRouter.getRouter());

export default router;
