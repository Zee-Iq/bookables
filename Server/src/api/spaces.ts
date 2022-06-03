import axios from "axios";
import express, { RequestHandler, ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import Bookables from "types";
import env from "../config/env";
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

async function setSpace(
  space: mongoose.Document<unknown, any, Bookables.Space> &
    Bookables.Space & {
      _id: mongoose.Types.ObjectId;
    },
  requestBody: any
) {
  for (const path in Space.schema.paths) {
    if (Object.prototype.hasOwnProperty.call(requestBody, path)) {
      if (path.startsWith("_") || path === "point" || path === "owner")
        continue;
      if (path === "address") {
        const location = await parseLocation(requestBody.address);
        space.set(path, location.address);
        space.set("point", location.point);
      } else {
        space.set(path, requestBody[path]);
      }
    }
  }
}

spacesRouter.post(
  "/create",
  catchErrors(async (req, res) => {
    const space = new Space();
    await setSpace(space, req.body);
    space.set("owner", req.user!._id);
    return res.status(201).json(await space.save());
  })
);

spacesRouter.patch(
  "/:spaceId/update",
  catchErrors(async (req, res, next) => {
    const { spaceId } = req.params;
    const space = await Space.findById(spaceId).exec();
    if (!space) throw new SpaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403);

    await setSpace(space, req.body);

    await space.save();
    return res.json(space);
  })
);

spacesRouter.delete(
  "/:spaceId/delete",
  catchErrors(async (req, res) => {
    const { spaceId } = req.params;
    const space = await Space.findById(spaceId).exec();
    if (!space) throw new SpaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403);
    await space.delete();
    return res.sendStatus(200);
  })
);

spacesRouter.post(
  "/:spaceId/addBookable",
  catchErrors(async (req, res) => {
    const { spaceId } = req.params;
    const space = await Space.findById(spaceId).exec();
    if (!space) throw new SpaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403);
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
    if (!space) throw new SpaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403);
    const bookable = space.bookables.find(
      (bookable) => bookable._id.toHexString() === bookableId
    );
    if (!bookable) throw new BookableNotFoundError(bookableId, spaceId);
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
    if (!space) throw new SpaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403);
    const initialLength = space.bookables.length;
    space.bookables = space.bookables.filter(
      (bookable) => !bookable._id.equals(bookableId)
    );
    if (initialLength === space.bookables.length)
      throw new BookableNotFoundError(bookableId, spaceId);
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
  if (error instanceof NoLocationFoundError)
    return res.status(400).json({ type: "NoLocationFoundError", error });
  if (error instanceof MultipleLocationsFoundError)
    return res.status(400).json({ type: "MultipleLocationsFoundError", error });
  return res.status(500).send(error.message);
};

spacesRouter.use(errorHandler);

class SpaceNotFoundError extends mongoose.Error.DocumentNotFoundError {
  constructor(public spaceId: string) {
    super(`Unable to find Space with id: ${spaceId}`);
  }
}

class BookableNotFoundError extends mongoose.Error.DocumentNotFoundError {
  constructor(public bookableId: string, public spaceId: string) {
    super(
      `Unable to find Bookable with id: ${bookableId} in Space with id: ${spaceId}`
    );
  }
}

async function parseLocation(
  address: Bookables.Address
): Promise<{ address: Bookables.Address; point: Bookables.Point }> {
  const response = await axios.get(
    `http://dev.virtualearth.net/REST/v1/Locations`,
    { params: { ...address, maxResults: 10, key: env.BING_MAPS } }
  );

  if (
    !response.data.resourceSets ||
    !Array.isArray(response.data.resourceSets) ||
    response.data.resourceSets.length === 0 ||
    !response.data.resourceSets[0].resources ||
    !Array.isArray(response.data.resourceSets[0].resources)
  ) {
    throw new UnexpectedResponseError(
      response.data,
      `http://dev.virtualearth.net/REST/v1/Locations`
    );
  }

  if (response.data.resourceSets[0].resources.length === 0)
    throw new NoLocationFoundError(address);
  if (response.data.resourceSets[0].resources.length > 1) {
    const possibleAddresses = response.data.resourceSets[0].resources.map(
      (resource: any) => resource.address
    );
    throw new MultipleLocationsFoundError(address, possibleAddresses);
  }

  return {
    address: response.data.resourceSets[0].resources[0].address,
    point: response.data.resourceSets[0].resources[0].point,
  };
}

class UnexpectedResponseError extends Error {
  constructor(public response: any, api: string) {
    super(`Unexpected Response from api: ${api}`);
  }
}

class NoLocationFoundError extends Error {
  constructor(public givenAddress: Bookables.Address) {
    super("No location found for given Address.");
  }
}

class MultipleLocationsFoundError extends Error {
  constructor(
    public givenAddress: Bookables.Address,
    public possibleAddresses: Bookables.Address[]
  ) {
    super("Multiple Locations found for given Address.");
  }
}

export default spacesRouter;
