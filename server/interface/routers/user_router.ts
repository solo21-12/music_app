import { Router, Request, Response } from "express";

const userRouter = Router();

userRouter.get("/hello", (req: Request, res: Response) => {
  res.send({
    message: "Hello world",
  });
});

export default userRouter;
