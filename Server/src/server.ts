import express from "express"
import Bookables from "types"



const app = express()

app.get("/greeting", (req, res) => {
    res.json({ "message": "Hello World" })
})


app.listen(4000, () => { console.log(" App running on 4000") })