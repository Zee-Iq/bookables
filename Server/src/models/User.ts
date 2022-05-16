import mongoose from "mongoose";
import Bookable from "types";
import jwt from "jsonwebtoken";
import env from "../config/env"

const bcrypt = require("bcrypt");
const saltRounds = 10;

const emailSchema = new mongoose.Schema<Bookable.Email>({
  address: {
    type: String,
    required: true,
    unique: true
   
  },

  isConfirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const paymentProvidersSchema = new mongoose.Schema<Bookable.PaymentProvider>({
  provider: {
    type: String,
    required: true,
  },

  cardnumber: {
    type: Number,
    required: true,
  },

  validationNumber: {
    type: Number,
    required: true,
  },

  owner: {
    type: String,
    required: true,
  },

  expiration: {
    type: Date,
    required: true,
  },
});

const payoutInformationSchema = new mongoose.Schema<Bookable.PayoutInformation>(
  {
    bic: {
      type: String,
      required: true,
    },

    iban: {
      type: String,
      required: true,
    },

    owner: {
      type: String,
      required: true,
    },
  }
);



const userSchema = new mongoose.Schema<Bookable.User>({
  email: {
    type: emailSchema,
    required: true

  },

  password: { type: String, required: true },

  roles: {
    type: [String],
  },

  paymentProviders: {
    type: paymentProvidersSchema,
  },

  payoutInformation: {
    type: payoutInformationSchema,
  }
 
});

const fakePassword = "12345";

let hashedPassword = "";

(async () => {
  hashedPassword = await generateHash(fakePassword);
})();

userSchema.static("verifyUser", async function (email, password) {
  const user = this.findOne({ "email.address": email });
  if (user) {
    return (await bcrypt.compare(password, user.password)) ? user : null;
  } else {
    return (await bcrypt.compare(fakePassword, hashedPassword)) ? null : null;
  }
});

async function generateHash(password: string) {
  const salt = await bcrypt.genSalt(saltRounds);

  return bcrypt.hash(password, salt);
}

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
   
        try {user.password = await generateHash(user.password)
        
        next() }
        
        catch(err: any){
          next(err)
        }
   
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

export default User;
