import dotenv from "dotenv";
dotenv.config();

class Env {
  readonly DB_USER: string;
  readonly DB_PASS: string;
  readonly DB_HOST: string;
  readonly DB_PORT: string;
  readonly DB_NAME: string;
  readonly PORT: string;
  readonly JWT_SECRET: string;
  readonly NODE_ENV: string;
  readonly SALT = 10;
  readonly ACCESS_TOKEN_EXPIRES_IN: number;
  readonly REFRESH_TOKEN_EXPIRES_IN: number;
  readonly BUCKET: string;
  readonly AWS_ACCESS_KEY_ID: string;
  readonly AWS_SECRET_ACCESS_KEY: string;
  readonly AWS_REGION: string;

  constructor() {
    this.DB_USER = process.env.DB_USER || "";
    this.DB_PASS = process.env.DB_PASS || "";
    this.DB_HOST = process.env.DB_HOST || "localhost";
    this.DB_PORT = process.env.DB_PORT || "27017";
    this.DB_NAME = process.env.DB_NAME || "mydb";
    this.PORT = process.env.PORT || "3000";
    this.JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
    this.NODE_ENV = process.env.NODE_ENV || "development";
    this.ACCESS_TOKEN_EXPIRES_IN =
      Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || 60;
    this.REFRESH_TOKEN_EXPIRES_IN =
      Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 60 * 60 * 24 * 7;
    this.BUCKET = process.env.BUCKET || "mybucket";
    this.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
    this.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";;
    this.AWS_REGION = process.env.AWS_REGION || "us-east-1";
  }
}

export default Env;
