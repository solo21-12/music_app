import { StatusCodes } from "http-status-codes";
import { JwtService } from "../../infrastructure";
import { UserRepository } from "../../repositories";
import { UserAuth } from "../../domain/dtos";

export class Middlewares {
  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository
  ) {}

  public async authMiddleware(req: any, res: any, next: any) {
    // Ensure authorization header is present
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Authorization token is required",
      });
    }

    // Extract token from header
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid authorization header format",
      });
    }

    // Verify token
    const isValid = this.jwtService.verifyToken(token);

    if (!isValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid or expired token",
      });
    }

    // Fetch user from repository
    const user = await this.userRepo.findByEmail(isValid.email);
    if (!user || (user as UserAuth).accessToken !== token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid token",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  }
}
