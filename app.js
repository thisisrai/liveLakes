const express     = require('express'),
      app         = express(),
      bodyParser  = require('body-parser'),
      mongoose    = require('mongoose'),
      port        = process.env.PORT || 3000, 
      Lake        = require("./models/lake"), 
      seedsDB     = require("./seed"), 
      Comments    = require("./models/comment")

seedsDB(); 

mongoose.connect("mongodb://localhost/lakes", {useMongoClient: true})
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.render("landing")
})

app.get("/lakes", (req, res) => {
  Lake.find({}, (err, lakes) => {
    if(err) {
      console.log('There was an error: ', err)
    } else {
      res.render("lakes/index", {lakes: lakes})
    }
  })
})

app.get("/lakes/new", (req, res) => {
  res.render("lakes/new")
})

app.get("/lakes/:id", (req, res) => {
  Lake.findById(req.params.id).populate('comments').exec((err, found) => {
    if(err) {
      console.log("There was an error: ", err)
    } else {
      res.render("lakes/show", {lake: found})
    }
  })
})

app.post("/lakes", (req, res) => {
  let name = req.body.name
  let url = req.body.url
  let description = req.body.description
  let newLake = {name: name, url: url, description: description}
  Lake.create(newLake, (err) => {
    if(err) {
      console.log("There was an error, here is the error: ", err)
    } else {
      res.redirect("/lakes")
    }
  })
});

app.get("/lakes/:id/comments/new", (req, res) => {
  Lake.findById(req.params.id, (err, lake) => {
    if(err) {
      console.log("There was an error: ", err)
    } else {
      res.render("comments/new", {lake: lake})
    }
  })
})

app.post("/lakes/:id/comments", (req, res) => {
  Lake.findById(req.params.id, (err, lake) => {
    if (err) {
      console.log("There was an error: ", err)
      alert('There was an error in adding the comment!')
      res.redirect('/lakes')
    } else {
      Comments.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err)
          alert('There was an error in adding the comment!')
          res.redirect('/lakes')
        } else {
          lake.comments.push(comment)
          lake.save()
          res.redirect("/lakes/" + req.params.id)
        }
      })
    }
  })
})

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})