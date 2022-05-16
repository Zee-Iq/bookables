import express from "express"
import Bookables from "types"
import mongoose from "mongoose";
import env from "./config/env";


mongoose.connect(env.MONGO_URI, () => console.log("mongo DB is connected")
)

const app = express()
app.use('/users',require('./api/users') );


 app.get("/greeting", (req, res) => {
    res.json({ "message": "Hello World" })
}) 






app.listen(4000, () => { console.log(" App running on 4000") })

