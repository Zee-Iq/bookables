import express, { RequestHandler, ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import Space from "../models/Space";
const spacesRouter = express.Router();

const authMiddleware: RequestHandler = async (req, res, next) => {
  console.warn("Replace with actual implementation of the authMiddleware.");
  req.user = {
    _id: new mongoose.Types.ObjectId("628ca4a90b48ec82d91b06ec"),
    email: { isConfirmed: true, address: "szymanekmilosz92@gmail.com" },
    roles: ["host", "tenant"],
  };
  next();
};

const catchErrors = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

spacesRouter.use(authMiddleware, express.json());

spacesRouter.get(
  "/owned",
  catchErrors(async (req, res) => {
    return res.json(await Space.find({ owner: req.user!._id }).exec());
  })
);

spacesRouter.post(
  "/create",
  catchErrors(async (req, res) => {
    return res
      .status(201)
      .json(await new Space({ ...req.body, owner: req.user!._id }).save());
  })
);

spacesRouter.patch(
  "/:spaceId/update",
  catchErrors(async (req, res, next) => {
    const { spaceId } = req.params;
    const space = await Space.findById(spaceId).exec();
    if (!space) spaceNotFoundError(spaceId);
    console.log("owner", space.owner)
    console.log("user", req.user!._id)
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403)
    Space.schema.eachPath((path) => {
      if (!path.startsWith("_") && req.body[path] !== undefined)
        space.set(path, req.body[path]);
    });
    await space!.save();
    return res.json(space);
  })
);

spacesRouter.delete(
  "/:spaceId/delete",
  catchErrors(async (req, res) => {
    const { spaceId } = req.params;
    const space = await Space.findById(spaceId).exec();
    if (!space) spaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403)
    await space.delete()
    return res.sendStatus(200);
  })
);

spacesRouter.post(
  "/:spaceId/addBookable",
  catchErrors(async (req, res) => {
    const { spaceId } = req.params;
    const space = await Space.findById(spaceId).exec();
    if (!space) spaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403)
    space.bookables.push(req.body);
    await space.save();
    return res.json(space);
  })
);

spacesRouter.patch(
  "/:spaceId/:bookableId/updateBookable",
  catchErrors(async (req, res) => {
    const { spaceId, bookableId } = req.params;
    const space = await Space.findById(spaceId).exec();
    if (!space) return spaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403)
    const bookable = space.bookables.find(
      (bookable) => bookable._id.toHexString() === bookableId
    );
    if (!bookable) bookableNotFoundError(bookableId, spaceId);
    Object.assign(bookable, req.body);
    await space.save();
    return res.json(space);
  })
);

spacesRouter.delete(
  "/:spaceId/:bookableId/deleteBookable",
  catchErrors(async (req, res) => {
    const { spaceId, bookableId } = req.params;
    const space = await Space.findById(spaceId).exec();
    if (!space) spaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403)
    const initialLength = space.bookables.length;
    space.bookables = space.bookables.filter(
      (bookable) => !bookable._id.equals(bookableId)
    );
    if (initialLength === space.bookables.length)
      bookableNotFoundError(bookableId, spaceId);
    await space.save();
    return res.json(space);
  })
);

const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
  console.error(error);

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ type: "ValidationError", error });
  }
  if (error instanceof mongoose.Error.DocumentNotFoundError)
    return res.status(404).json({ type: "DocumentNotFoundError", error });
  if (error instanceof mongoose.Error.CastError)
    return res.status(400).json({ type: "CastError", error });

  return res.status(500).send("Unhandled Exception occoured.");
};

spacesRouter.use(errorHandler);

function spaceNotFoundError(spaceId: string): never {
  throw new mongoose.Error.DocumentNotFoundError(
    `Unable to find Space with id: ${spaceId}`
  );
}

function bookableNotFoundError(bookableId: string, spaceId: string): never {
  throw new mongoose.Error.DocumentNotFoundError(
    `Unable to find Bookable with id: ${bookableId} in Space with id: ${spaceId}`
  );
}

export default spacesRouter;
