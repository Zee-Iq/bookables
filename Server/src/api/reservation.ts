import express, { ErrorRequestHandler } from "express";
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

export default reservationRouter;
