import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import env from "../config/env";
import sendEmail from '../utils/email'
const router = express.Router();


router.use(express.json())
router.post("/register", async (req, res) => {
  try {
    const { email, password, paymentProviders, payoutInformation } =
      req.body;

    if (
      !email ||
      !password ||
      !paymentProviders ||
      !payoutInformation
    )
      return res.send({ success: false, errorId: 1 });

    const newUser = new User({"email.address": email, password, paymentProviders, payoutInformation});

    const user = await newUser.save();

    const token = await jwt.sign({id: user._id.toHexString(), "email.address": user.email.address}, env.SECRET, {
      expiresIn: "1d"
  })
    // send an email to the user that just got registered
    sendEmail(user.email.address, token)

    console.log("user",user);


    

    res.send({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.log("ERROR:", error.message);
      return res.send(error.message);
    }

    console.log(error);

    return res.status(500).send("unknown error code");
  }
});


module.exports = router ;