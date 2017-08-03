const express         = require('express'),
      app             = express(),
      bodyParser      = require('body-parser'),
      mongoose        = require('mongoose'),
      port            = process.env.PORT || 3000, 
      Lake            = require("./models/lake"), 
      seedsDB         = require("./seed"), 
      Comments        = require("./models/comment"), 
      passport        = require("passport"), 
      methodOverride  = require("method-override")
      localStrategy   = require("passport-local"), 
      User            = require("./models/user"), 
      expressSession  = require("express-session"), 
      indexRoutes     = require("./routes/index"), 
      lakesRoutes     = require("./routes/lakes"), 
      commentsRoutes  = require("./routes/comments")

// seedsDB(); 

mongoose.connect("mongodb://localhost/lakes", {useMongoClient: true})
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(methodOverride("_method"))
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

app.use(indexRoutes)
app.use("/lakes", lakesRoutes)
app.use("/lakes/:id/comments", commentsRoutes)

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})