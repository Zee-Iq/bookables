import express from "express";
import User from "../models/User";
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