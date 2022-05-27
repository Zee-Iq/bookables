import { model, Schema, Document, Types, ValidateOpts } from "mongoose";
import Bookables from "types";



//Validators
const hasOnlyUniqueIds: ValidateOpts<Bookables.Bookable[]> = {
  validator(bookables: Bookables.Bookable[]){
      const uniqueIds = new Map<string, boolean>()
      for (const bookable of bookables) {
          if(uniqueIds.has(bookable.identification)) return false
          uniqueIds.set(bookable.identification, true)
      }
      return true
  },
  message: `Each Bookable contained within a space must have a unique id.`
}; 


//Subschemas
const bookableSchema = new Schema<Bookables.Bookable>({
  identification: {
    type: String,
    required: true,
    unique: true,
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
  addressLine: String,
  adminDistrict2: String,
  adminDistrict: String,
  countryRegion: String,
  formattedAddress: String,
  locality: String,
  postalCode: String,
});

const contactInformationSchema = new Schema<Bookables.ContactInformation>({
  email: String,
  phoneNumber: String,
});

//SpaceSchema
const spaceSchema = new Schema<Bookables.Space>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: { type: String, required: true },
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

const Space = model("Space", spaceSchema);
export default Space;
