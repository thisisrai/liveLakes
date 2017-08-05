const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require("../models/user")

router.get("/", (req, res) => {
  res.render("landing")
})

router.get("/register", (req, res) => {
  res.render("register")
})

router.post("/register", (req, res) => {
  const newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      req.flash("error", err.message)
      res.redirect("register")
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Congrats on creating an account!")
      res.redirect("/places")
    })
  })
})

router.get("/login", (req, res) => {
  res.render("login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/places",
    failureRedirect: "/login"
  }), (req, res) => {
})

router.get("/logout", (req, res) => {
  req.logout()
  req.flash("success", "You logged out successfully!")
  res.redirect("/places")
})

module.exports = router