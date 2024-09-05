import { sign, verify } from "jsonwebtoken";
import Env from "../config/env_config";
import { JwtPayload } from "../domain/interfaces";

export class JwtService {
  constructor(private env: Env) {
    this.env = env;
  }

  generateToken(payload: object, expireIn: number): string {
    return sign(payload, this.env.JWT_SECRET, {
      expiresIn: expireIn,
    });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return verify(token, this.env.JWT_SECRET) as JwtPayload;
    } catch (e) {
      return null;
    }
  }
}
