import { S3 } from "aws-sdk";
import Env from "../config/env_config";
import { ErrorResponse } from "../domain/dtos";
import { InternalServerError } from "../domain/dtos/error_response";
import { Readable } from "stream";

export class UploadService {
  private s3 = new S3();

  constructor(private env: Env) {
    this.s3 = new S3({
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
    });
  }

  async uploadFile(key: string, file: Buffer): Promise<ErrorResponse | null> {
    try {
      await this.s3
        .putObject({
          Bucket: this.env.BUCKET,
          Key: key,
          Body: file,
        })
        .promise();

      return null;
    } catch (error: any) {
      console.error(`Error uploading file: ${error}`);
      return InternalServerError("Error uploading file");
    }
  }

  async getFileUrl(
    key: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    return this.s3.getSignedUrl("getObject", {
      Bucket: this.env.BUCKET,
      Key: key,
      Expires: expiresInSeconds,
    });
  }

  async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async deleteFile(key: string): Promise<ErrorResponse | null> {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.env.BUCKET,
          Key: key,
        })
        .promise();

      return null;
    } catch (error: any) {
      console.error(`Error deleting file: ${error}`);
      return InternalServerError("Error deleting file");
    }
  }
}
