const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")

let lakes = [
  {name: "Lake Chabot", url: "http://www.timfiebig.com/uploads/agent-1/CV%20lake%20chabot.jpg"}, 
  {name: "Freemont Lake", url: "http://www.visitpinedale.org/cache/made/images/lakes/fremont-lake/upper-fremont-lake_760_506_76auto.jpg"}, 
  {name: "Lake Merrit", url: "https://s-media-cache-ak0.pinimg.com/originals/ce/a3/6d/cea36d4036a6fd344411229a53a7a0e8.jpg"}
]

app.get("/", (req, res) => {
  res.render("landing")
})

app.get("/lakes", (req, res) => {
  res.render("lakes", {lakes: lakes})
})

app.get("/lakes/new", (req, res) => {
  res.render("new")
})

app.post("/lakes", (req, res) => {
  let name = req.body.name
  let url = req.body.url
  console.log(name, url)
  lakes.push({name: name, url: url})
  res.redirect("/lakes")
});

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})