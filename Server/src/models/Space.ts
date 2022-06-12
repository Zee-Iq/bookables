import { model, Schema, Document, Types, ValidateOpts } from "mongoose";
import Bookables from "types";

const pointSchema = new Schema<Bookables.Point>({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const addressSchema = new Schema<Bookables.Address>({
  addressLine: { type: String, required: true },
  adminDistrict2: { type: String },
  adminDistrict: { type: String, required: true },
  countryRegion: { type: String, required: true },
  formattedAddress: { type: String, required: true },
  locality: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const contactInformationSchema = new Schema<Bookables.ContactInformation>({
  email: { type: String, required: true },
  phoneNumber: String,
});

//SpaceSchema
const spaceSchema = new Schema<Bookables.Space>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: false,
    },
    name: { type: String, required: true, unique: false },
    description: String,
    address: { type: addressSchema, required: true },
    contactInformation: { type: contactInformationSchema, required: true },
    point: { type: pointSchema, required: true }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true },  }
);

spaceSchema.virtual("bookables", {
  ref: "Bookable",
  localField: "_id",
  foreignField: "spaceId",
});

spaceSchema.index({ owner: 1, name: 1 }, { unique: true });
spaceSchema.index({point: "2dsphere"})

const Space = model<Bookables.Space>("Space", spaceSchema);
export default Space;
