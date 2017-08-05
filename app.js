const express         = require('express'),
      app             = express(),
      bodyParser      = require('body-parser'),
      mongoose        = require('mongoose'),
      port            = process.env.PORT || 3000, 
      Place            = require("./models/place"), 
      seedsDB         = require("./seed"), 
      Comments        = require("./models/comment"), 
      passport        = require("passport"), 
      methodOverride  = require("method-override")
      localStrategy   = require("passport-local"), 
      flash           = require("connect-flash")
      User            = require("./models/user"), 
      expressSession  = require("express-session"), 
      indexRoutes     = require("./routes/index"), 
      placesRoutes     = require("./routes/places"), 
      commentsRoutes  = require("./routes/comments")

// seedsDB(); 

mongoose.connect("mongodb://railee:coolplace123@ds135963.mlab.com:35963/heroku_1gn9bmcw", {useMongoClient: true})
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

app.use(flash())

app.use(function(req, res, next){
  res.locals.currentUser = req.user
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next(); 
})


app.use(indexRoutes)
app.use("/places", placesRoutes)
app.use("/places/:id/comments", commentsRoutes)

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})