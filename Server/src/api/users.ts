import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import env from "../config/env";
import sendEmail from "../utils/email";



const userRouter = express.Router();

userRouter.use(express.json());
userRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.send({ success: false, errorId: 1 });

    const newUser = new User({
      "email.address": email,
      password

    });

    const user = await newUser.save();

    const token = await jwt.sign(
      { id: user._id.toHexString(), "email.address": user.email.address },
      env.SECRET,
      {
        expiresIn: "1d",
      }
    );

    // send an email to the user that just got registered
    sendEmail(user.email.address, token);

    res.send({ success: true, token: token, user: user });
  } catch (error) {
    if (error instanceof Error) {
      console.error("ERROR:", error);
      return res.send(error.message);
    }

    console.error(error);

    return res.status(500).send("unknown error code");
  }
});

userRouter.get("/emailConfirmation/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const verify = jwt.verify(token, env.SECRET);

    if (typeof verify == "string") {
      return res.sendStatus(400);
    }


    const updatedUser = await User.findByIdAndUpdate(
      verify.id,

      { "email.isConfirmed": true },

      { new: true }
    );

    if (!updatedUser) return res.send({ success: false });

    res.send({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("ERROR:", error);

      return res.send(error.message);
    }

    console.error(error);

    return res.status(500).send("unknown error code");
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.verifyUser(email, password);

    // 
    if (!user) return res.send({ success: false, loginError: "user or password invalid" });

    const token = await jwt.sign(
      { id: user._id.toHexString(), "email.address": user.email.address },
      env.SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.send({ success: true, token: token, user: user });


  } catch (error) {
    if (error instanceof Error) {
      console.error("ERROR:", error);

      return res.send(error.message);
    }

    console.error(error);

    return res.status(500).send("unknown error code");
  }
});


userRouter.post("/updatedUser", async (req, res) => {

  try {

    const {token} = req.body

    if (!token)
      return res.send({ success: false, errorId: 1 });

    const verify = jwt.verify(token, env.SECRET);

    if (typeof verify == "string") {
      return res.sendStatus(400);
    }

    
    const user = await User.findOne({_id:  verify.id});

    if (!user) return res.send({ success: false, loginError: "user does not exist" });

    res.send({ success: true, user: user });
  }

  catch (error) {

    if (error instanceof Error) {
      
      console.error("ERROR:", error);

      return res.send(error.message);
    }

    console.error(error);

    return res.status(500).send("unknown error code");
  }


})

/* userRouter.post("/updatePayoutInfo", async (req, res) => {

  try {
    const { userUpdate} = req.body
  }


}) */


export default userRouter;
