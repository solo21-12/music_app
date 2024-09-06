import { hash, compare } from "bcrypt";
import Env from "../config/env_config";
import zxcvbn from "zxcvbn";
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

  async checkPasswordStrength(password: string): Promise<string | null> {
    const result = zxcvbn(password);
    if (result.score < 3) {
      return "weak password  " + result.feedback.suggestions.join(" ");
    }

    return null;
  }
}
