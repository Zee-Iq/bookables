import mongoose, {Model, Types, Document} from "mongoose";
import Bookables from "types";
import jwt from "jsonwebtoken";
import env from "../config/env"

const bcrypt = require("bcrypt");
const saltRounds = 10;

const emailSchema = new mongoose.Schema<Bookables.Email>({
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

const paymentProvidersSchema = new mongoose.Schema<Bookables.PaymentProvider>({
  provider: {
    type: String
   
  },

  cardnumber: {
    type: Number
    
  },

  validationNumber: {
    type: Number
    
  },

  owner: {
    type: String
    
  },

  expiration: {
    type: Date
    
  },
});

const payoutInformationSchema = new mongoose.Schema<Bookables.PayoutInformation>(
  {
    bic: {
      type: String
     
    },

    iban: {
      type: String
      
    },

    owner: {
      type: String
      
    },
  }
);



const userSchema = new mongoose.Schema<Bookables.User, UserModel>({
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


interface UserModel extends Model<Bookables.User> {

  verifyUser(email: string, password: string): (Document<unknown, any, Bookables.User> & Bookables.User & {
    _id: Types.ObjectId;
}) | null
}

const fakePassword = "12345";

let hashedPassword = "";

(async () => {
  hashedPassword = await generateHash(fakePassword);
})();

userSchema.static("verifyUser", async function (email, password) {
  const user = await this.findOne({ "email.address": email });
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

const User = mongoose.model<Bookables.User, UserModel>("User", userSchema);

export default User;
