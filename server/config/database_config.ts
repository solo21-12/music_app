import mongoose from "mongoose";
import Env from "./env_config";

class Database {
  private static instance: Database | null = null;
  private mongoUrl: string;

  private constructor(private env: Env) {
    this.mongoUrl = `mongodb://localhost:27017/music_app`;
  }

  public static getInstance(env: Env): Database {
    if (Database.instance === null) {
      Database.instance = new Database(env);
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.mongoUrl);
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
  }

  public getDb(): mongoose.Connection {
    if (!mongoose.connection.readyState) {
      throw new Error(
        "Database connection is not established. Call connect() first."
      );
    }
    return mongoose.connection;
  }

  public async close(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("MongoDB connection closed.");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    }
  }
}

export default Database;
