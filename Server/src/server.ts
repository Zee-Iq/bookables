import express, { ErrorRequestHandler } from "express";
import Bookables from "types";
import mongoose from "mongoose";
import env from "./config/env";
import spacesRouter from "./api/spaces"
import userRouter from "./api/users"

declare global {
  namespace Express {
    interface Request {
      user?: Bookables.ShareableUser;
    }
  }
}

mongoose.connect(env.MONGO_URI, () => console.log("mongo DB is connected"));

const app = express();

app.use("/users", userRouter);
app.use("/spaces", spacesRouter);

app.listen(4000, () => {
  console.log(" App running on 4000");
});






