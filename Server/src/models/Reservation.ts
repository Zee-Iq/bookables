import { Schema, model } from "mongoose";
import Bookables from "types";

const reservationSchema = new Schema<Bookables.Reservation>({
  bookableId: {
    type: Schema.Types.ObjectId,
    ref: "Space",
    required: true,
    index: true,
    unique: false,
  },
  from: { type: Date, required: true, index: true },
  to: { type: Date, required: true, index: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default model<Bookables.Reservation>("Reservation", reservationSchema);
