import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import env from "../config/env";
import sendEmail from "../utils/email";
const router = express.Router();

router.use(express.json());
router.post("/register", async (req, res) => {
  try {
    const { email, password, paymentProviders, payoutInformation } = req.body;

    if (!email || !password || !paymentProviders || !payoutInformation)
      return res.send({ success: false, errorId: 1 });

    const newUser = new User({
      "email.address": email,
      password,
      paymentProviders,
      payoutInformation,
    });

    const user = await newUser.save();

    const token = await jwt.sign(
      { id: user._id.toHexString(), "email.address": user.email.address },
      env.SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log("token is", token);

    // send an email to the user that just got registered
    sendEmail(user.email.address, token);

    console.log("user", user);

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

router.get("/emailConfirmation/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const verify = jwt.verify(token, env.SECRET);

    const verifyObject = JSON.parse(JSON.stringify(verify) as string);

    const updatedUser = User.findByIdAndUpdate(
      verifyObject.id,
      { isConfirmed: false },
      { new: true }
    );

    console.log("updatedUser", updatedUser);

    if (!updatedUser) return res.send({ success: false });

    res.send({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.log("ERROR:", error.message);
      return res.send(error.message);
    }

    console.log(error);

    return res.status(500).send("unknown error code");
  }

  /* try {

      const token = req.params.token
      console.log('token is ', token)

      // find the user with provided id (id is contained inside JWT)
      // update the user and set emailverified to true

      const payload = await User.getPayload(token)
      console.log('payload is ', payload)

      const id = payload.id

      const updatedUser = User.findByIdAndUpdate(id, {emailVerified: true}, {new: true})

      if (!updatedUser) return res.send({success: false})

      res.send({success: true})

  } catch (error) {
      
      console.log('email confirm ERROR:', error.message)
      res.send(error.message)
  } */
});

module.exports = router;
