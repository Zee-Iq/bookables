import express, { ErrorRequestHandler } from "express";
import { InvalidQueryParameterError, MissingQueryParameterError } from "../errors";
import Reservation from "../models/Reservation";
import { catchErrors } from "../utils";

const reservationRouter = express.Router();

reservationRouter.use(express.json());

reservationRouter.get(
  "/list",
  catchErrors(async (req, res) => {
    const reservations = await Reservation.find();
    res.json(reservations);
  })
);

reservationRouter.post(
  "/create",
  catchErrors(async (req, res) => {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.json(reservation);
  })
);

reservationRouter.delete(
  "/delete",
  catchErrors(async (req, res) => {
    const { reservationId } = req.body;
    if (!reservationId) throw new Error();
    const reservation = await Reservation.findByIdAndDelete(
      reservationId
    ).exec();
    if (!reservation) return res.sendStatus(404);
    res.sendStatus(200);
  })
);

reservationRouter.get("/available", async (req, res) => {
    let { from, to, point, radius, type } = req.query;
    if (!from || !to || !type)
      throw new MissingQueryParameterError(["from", "to", "type"], req.query);
    if (type !== "room" && type !== "seat")
      throw new InvalidQueryParameterError(["room", "seat"], type);
  
    const reservationsInTimeRange = await Reservation.find({ from: { $lt: to }, to: {$gt: from}});
    res.json(reservationsInTimeRange)
  });

const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
  console.error(error);
  return res.status(500).send(error.message);
};

reservationRouter.use(errorHandler);

export default reservationRouter;
