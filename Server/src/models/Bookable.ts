import { Schema, model } from "mongoose";
import Bookables from "types";

const bookableSchema = new Schema<Bookables.Bookable>({
  hourlyRate: { type: Number, required: true },
  name: { type: String, required: true, index: true, unique: false },
  spaceId: {
    type: Schema.Types.ObjectId,
    ref: "Space",
    required: true,
    index: true,
    unique: false,
  },
  type: { type: String, enum: ["room", "seat"], required: true },
});

bookableSchema.index({name: 1, spaceId: 1}, {unique: true})

export default model("Bookable", bookableSchema);
