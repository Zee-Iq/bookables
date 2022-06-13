import { RequestHandler } from "express";
import User from "./models/User";
import jwt from "jsonwebtoken";
import env from "./config/env";



export const catchErrors = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
