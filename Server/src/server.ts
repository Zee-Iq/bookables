import express from "express"

let SpecialUser: Bookables.SpecialUser = {doesSomething: () => 5, email:"test",password:"1234",phoneNumber:"123456", somethingElse: "dwadwa"}
let user: Bookables.User = {doesSomething: () => 5, email:"test",password:"1234",phoneNumber:"123456"}

user = SpecialUser

const app = express()

app.get("/greeting", (req, res) => {
    res.json({ "message": "Hello World" })
})


app.listen(4000, () => { console.log(" App running on 4000") })