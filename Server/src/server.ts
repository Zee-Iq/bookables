import express, { ErrorRequestHandler } from "express";
import Bookables from "types";
import mongoose from "mongoose";
import env from "./config/env";
import spacesRouter from "./api/spaces"
import userRouter from "./api/users"
import path from "path";

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

const spaDir = path.join(__dirname,"public")
const spaIndex = path.join(spaDir,"index.html")
app.use("/", express.static(spaDir))
app.get("*", (req, res) => {
  res.sendFile(spaIndex)
})

app.listen(env.WEBSITES_PORT || 4000, () => {
  console.log(`App running on ${env.WEBSITES_PORT}`);
});
