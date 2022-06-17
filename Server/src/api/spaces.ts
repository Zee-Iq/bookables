import axios from "axios";
import express, { RequestHandler, ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import Bookables from "types";
import env from "../config/env";
import Space from "../models/Space";
import Bookable from "../models/Bookable";
import Reservation from "../models/Reservation";
import { catchErrors } from "../utils";
import {
  BookableNotFoundError,
  InvalidQueryParameterError,
  MissingQueryParameterError,
  MultipleLocationsFoundError,
  NoLocationFoundError,
  SpaceNotFoundError,
  UnexpectedResponseError,
} from "../errors";
import { authMiddleware } from "../middlewares/auth";

const spacesRouter = express.Router();

spacesRouter.use(express.json());

spacesRouter.get(
  "/list",
  catchErrors(async (req, res) => {
    const spaces = await Space.find().exec();
    res.json(spaces);
  })
);

spacesRouter.get(
  "/availableinarea",
  catchErrors(async (req, res) => {
    const { from, to, types: typesQuery, nw: nwQuery, se: seQuery } = req.query;
    if (!from || !to || !typesQuery || !nwQuery || !seQuery)
      throw new MissingQueryParameterError(
        ["from", "to", "types", "nw", "se"],
        req.query
      );
    let types: "room" | "seat"[];
    try {
      types = JSON.parse(typesQuery as string);
    } catch (error) {
      console.log(error);
      throw new InvalidQueryParameterError(
        "types",
        '"room" | "seat"[]',
        typesQuery
      );
    }

    let nw: number[];
    try {
      nw = JSON.parse(nwQuery as string);
    } catch (error) {
      console.log(error);
      throw new InvalidQueryParameterError(
        "ne",
        "[longitude, latitude]",
        nwQuery
      );
    }

    let se: number[];
    try {
      se = JSON.parse(seQuery as string);
    } catch (error) {
      console.log(error);
      throw new InvalidQueryParameterError(
        "se",
        "[longitude, latitude]",
        seQuery
      );
    }

    const unavailableBookableIds = await Reservation.find({
      from: { $lte: to },
      to: { $gte: from },
    })
      .exec()
      .then((reservations) =>
        reservations.map((reservation) => reservation.bookableId)
      );

    /*     const spaces = await Space.find({
      point: {
        $geoWithin: {
          $geometry: {
            type: "Polygon",
            coordinates: [
              [
                [11.647095532226572, 51.660819175987264],
                [12.222504467773447, 51.660819175987264],
                [12.222504467773447, 51.30247689929721],
                [11.647095532226572, 51.30247689929721],
                [11.647095532226572, 51.660819175987264],
              ],
            ],
          },
        },
      },
    })
      .populate({
        path: "bookables",
        match: {
          _id: { $nin: unavailableBookableIds },
          type: { $in: types },
        },
      })
      .exec(); */

    const spaces = await Space.where("point")
      .within({
        box: [nw, se],
      })
      .populate({
        path: "bookables",
        match: {
          _id: { $nin: unavailableBookableIds },
          type: { $in: types },
        },
      })
      .exec();

    /*       const spaces = await Space.find({
      point: {
        $near: {
          $geometry: { type: "Point", coordinates: [lat, long] },
          $maxDistance: radius,
        },
      },
    })
      .populate({
        path: "bookables",
        match: {
          _id: { $nin: unavailableBookableIds },
          type: { $in: types },
        },
      })
      .exec(); */

    res.json(spaces);
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
  catchErrors(async (req, res) => {
    const { spaceId } = req.params;
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
    const bookable = new Bookable({ ...req.body, spaceId, _id: undefined });
    await bookable.save();
    await space.populate("bookables");
    return res.json(space);
  })
);

spacesRouter.patch(
  "/:spaceId/:bookableId/updateBookable",
  catchErrors(async (req, res) => {
    console.log("here")
    const { spaceId, bookableId } = req.params;
    const [space, bookable] = await Promise.all([
      Space.findById(spaceId).exec(),
      Bookable.findById(bookableId).exec(),
    ]);
    if (!space) throw new SpaceNotFoundError(spaceId);
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
    if (!space) throw new SpaceNotFoundError(spaceId);
    if (!space.owner.equals(req.user!._id)) return res.sendStatus(403);
    if (!bookable || !bookable.spaceId.equals(space._id))
      throw new BookableNotFoundError(bookableId, spaceId);
    await bookable.delete();
    await space.populate("bookables");
    return res.json(space);
  })
);

async function parseLocation(
  address: Bookables.Address
): Promise<{ address: Bookables.Address; point: Bookables.Point }> {
  const response = await axios.get(
    `https://dev.virtualearth.net/REST/v1/Locations`,
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
      `https://dev.virtualearth.net/REST/v1/Locations`
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
    point: {
      type: "Point",
      coordinates: [
        response.data.resourceSets[0].resources[0].point.coordinates[1],
        response.data.resourceSets[0].resources[0].point.coordinates[0],
      ],
    },
  };
}

export default spacesRouter;
