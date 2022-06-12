import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ClientError } from "../errors";

export const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
    console.error(error);
  
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ type: "ValidationError", error });
    }
    if (error instanceof mongoose.Error.DocumentNotFoundError)
      return res.status(404).json({ type: "DocumentNotFoundError", error });
    if (error instanceof mongoose.Error.CastError)
      return res.status(400).json({ type: "CastError", error });
    if (error instanceof ClientError)
      return res.status(400).json({ type: error.name, error });
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(422).send({ type: "DuplicateKeyError", error });
    }
    return res.status(500).send(error.message);
  };