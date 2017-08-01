const express         = require('express'),
      app             = express(),
      bodyParser      = require('body-parser'),
      mongoose        = require('mongoose'),
      port            = process.env.PORT || 3000, 
      Lake            = require("./models/lake"), 
      seedsDB         = require("./seed"), 
      Comments        = require("./models/comment")
      passport        = require("passport")
      localStrategy   = require("passport-local")
      User            = require("./models/user")
      expressSession  = require("express-session")

seedsDB(); 

mongoose.connect("mongodb://localhost/lakes", {useMongoClient: true})
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(expressSession({
  secret: "Visit Lakes!", 
  resave: false, 
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
  res.locals.currentUser = req.user
  next(); 
})

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

app.get("/lakes/:id/comments/new", isLoggedIn, (req, res) => {
  Lake.findById(req.params.id, (err, lake) => {
    if(err) {
      console.log("There was an error: ", err)
    } else {
      res.render("comments/new", {lake: lake})
    }
  })
})

app.post("/lakes/:id/comments", isLoggedIn, (req, res) => {
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

app.get("/register", (req, res) => {
  res.render("register")
})

app.post("/register", (req, res) => {
  const newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err)
      return res.render("register")
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/lakes")
    })
  })
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/lakes", 
    failureRedirect: "/login"
  }), (req, res) => {
})

app.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/lakes")
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})