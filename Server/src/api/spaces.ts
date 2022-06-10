import axios from "axios";
import express, { RequestHandler, ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import Bookables from "types";
import env from "../config/env";
import Space from "../models/Space";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Bookable from "../models/Bookable";
import Reservation from "../models/Reservation";
import { authMiddleware, catchErrors } from "../utils";
import { BookableNotFoundError, ClientError, MultipleLocationsFoundError, NoLocationFoundError, SpaceNotFoundError, UnexpectedResponseError } from "../errors";

const spacesRouter = express.Router();



spacesRouter.use(express.json(), express.urlencoded());

spacesRouter.get(
  "/",
  catchErrors(async (req, res) => {
    console.warn("Implement fetching spaces by location and radius.");
    return res.json(await Space.find().exec());
  })
);

spacesRouter.use(catchErrors(authMiddleware()));

spacesRouter.get(
  "/owned",
  catchErrors(async (req, res) => {
    return res.json(
      await Space.find({ owner: req.user!._id }).populate("bookables").exec()
    );
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
    await (await space.populate("bookables")).save();
    return res.status(201).json(space);
  })
);

spacesRouter.patch(
  "/:spaceId/update",
  catchErrors(async (req, res, next) => {
    const { spaceId } = req.params;
    console.log(spaceId);
    const space = await Space.findById(spaceId).exec();
    if (!space) throw new SpaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403);

    await setSpace(space, req.body);

    await space.save();
    await space.populate("bookables");
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
    const bookable = new Bookable({ ...req.body, spaceId });
    await bookable.save();
    await space.populate("bookables");
    return res.json(space);
  })
);

spacesRouter.patch(
  "/:spaceId/:bookableId/updateBookable",
  catchErrors(async (req, res) => {
    const { spaceId, bookableId } = req.params;
    const [space, bookable] = await Promise.all([
      Space.findById(spaceId).exec(),
      Bookable.findById(bookableId).exec(),
    ]);
    if (!space) throw new SpaceNotFoundError(spaceId);
    console.log(bookable);
    if (!bookable || !bookable.spaceId.equals(space._id))
      throw new BookableNotFoundError(bookableId, spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403);
    Object.assign(bookable, req.body);
    await bookable.save();
    await space.populate("bookables");
    return res.json(space);
  })
);

spacesRouter.delete(
  "/:spaceId/:bookableId/deleteBookable",
  catchErrors(async (req, res) => {
    const { spaceId, bookableId } = req.params;
    const [space, bookable] = await Promise.all([
      Space.findById(spaceId).exec(),
      Bookable.findById(bookableId).exec(),
    ]);
    console.log("space", space);
    console.log("bookables", bookable);
    if (!space) throw new SpaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403);
    if (!bookable || !bookable.spaceId.equals(space._id))
      throw new BookableNotFoundError(bookableId, spaceId);
    await bookable.delete();
    await space.populate("bookables");
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
  if (error instanceof ClientError)
    return res.status(400).json({ type: error.name, error });
  if (error.name === "MongoServerError" && error.code === 11000) {
    return res.status(422).send({ type: "DuplicateKeyError", error });
  }
  return res.status(500).send(error.message);
};

spacesRouter.use(errorHandler);

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



export default spacesRouter;
