import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cookiesParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import Env from "../config/env_config";
import router from "../interface/routers/routes";
import Database from "../config/database_config";

const env = new Env();
const port = Number(env.PORT) || 3000;

const app: Express = express();
const db = Database.getInstance(env);
db.connect();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookiesParser());
app.use(compression());
app.use(cors());

if (env.NODE_ENV === "production") {
  app.use(helmet());
}

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
