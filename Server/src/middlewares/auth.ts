import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import User from "../models/User";

export const authMiddleware: ({
    allowUnauthenticated,
  }?: {
    allowUnauthenticated: boolean;
  }) => RequestHandler =
    ({ allowUnauthenticated } = { allowUnauthenticated: false }) =>
    async (req, res, next) => {
      const [method, token] = req.headers.authorization?.split(" ") || [
        null,
        null,
      ];
      if (method?.toLowerCase() !== "bearer" || typeof token !== "string")
        return res.sendStatus(401);
      const payload = await jwt.verify(token, env.SECRET);
      if (typeof payload === "string")
        throw new Error("Unexpected Token payload.");
      const user = await User.findById(payload.id);
      if (!user) return res.sendStatus(403);
      req.user = user;
      next();
    };