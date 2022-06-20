import express, { ErrorRequestHandler } from "express";
import { authMiddleware } from "../middlewares/auth";
import Reservation from "../models/Reservation";
import { catchErrors } from "../utils";

const reservationRouter = express.Router();

reservationRouter.use(express.json());

reservationRouter.use(catchErrors(authMiddleware()));

reservationRouter.get(
  "/own",
  catchErrors(async (req, res) => {
    const reservations = await Reservation.find({
      user: req.user?._id,
    }).populate(["user", "bookable"]);
    res.json(reservations);
  })
);

reservationRouter.post(
  "/create",
  catchErrors(async (req, res) => {
    if (!req.user?.roles.includes("tenant"))
      throw new Error("Only Tenants can create reservations.");
    const reservation = new Reservation({ ...req.body, user: req.user?._id });
    await (await reservation.save()).populate(["user", "bookable"]);
    res.json(reservation);
  })
);

reservationRouter.delete(
  "/delete",
  catchErrors(async (req, res) => {
    const { reservationId } = req.body;
    if (!reservationId) throw new Error("Reservation ID missing.");
    const reservation = await Reservation.findByIdAndDelete(
      reservationId
    ).exec();
    if (!reservation) return res.sendStatus(404);
    if (reservation.user !== req.user?._id) return res.sendStatus(403);
    res.sendStatus(200);
  })
);

export default reservationRouter;
