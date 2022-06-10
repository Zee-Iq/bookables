import { model, Schema, Document, Types, ValidateOpts } from "mongoose";
import Bookables from "types";

//Validators
const hasOnlyUniqueIds: ValidateOpts<Bookables.Bookable[]> = {
  validator(bookables: Bookables.Bookable[]) {
    const uniqueIds = new Map<string, boolean>();
    for (const bookable of bookables) {
      if (uniqueIds.has(bookable.identification)) return false;
      uniqueIds.set(bookable.identification, true);
    }
    return true;
  },
  message: `Each Bookable contained within a space must have a unique id.`,
};

//Subschemas
const bookableSchema = new Schema<Bookables.Bookable>({
  identification: {
    type: String,
    required: true,
  },
  type: { type: String, enum: ["seat", "room"], required: true },
});

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
  adminDistrict2: { type: String},
  adminDistrict: { type: String, required: true },
  countryRegion: { type: String, required: true },
  formattedAddress: { type: String, required: true },
  locality: { type: String, required: true },
  postalCode: { type: String, required: true }
});

const contactInformationSchema = new Schema<Bookables.ContactInformation>({
  email: { type: String, required: true },
  phoneNumber: String,
});

//SpaceSchema
const spaceSchema = new Schema<Bookables.Space>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
    unique: false
  },
  name: { type: String, required: true, unique: false },
  description: String,
  address: { type: addressSchema, required: true },
  contactInformation: { type: contactInformationSchema, required: true },
  point: { type: pointSchema, required: true },
  bookables: {
    type: [bookableSchema],
    required: true,
    validate: [hasOnlyUniqueIds],
  },
});

spaceSchema.index({owner: 1, name: 1}, {unique: true})

const Space = model("Space", spaceSchema);
export default Space;
