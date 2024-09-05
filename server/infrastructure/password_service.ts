import { hash, compare } from "bcrypt";
import Env from "../config/env_config";

export class PasswordService {
  constructor(private env: Env) {
    this.env = env;
  }
  async hashPassword(password: string): Promise<string> {
    return hash(password, this.env.SALT);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
