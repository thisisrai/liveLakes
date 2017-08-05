const express = require("express")
const router = express.Router()
const Place = require("../models/place")
const middlewareObj = require("../middleware")

router.get("/", (req, res) => {
  Place.find({}, (err, places) => {
    if(err) {
      console.log('There was an error: ', err)
    } else {
      res.render("places/index", {places: places})
    }
  })
})

router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
  res.render("places/new")
})

router.get("/:id", (req, res) => {
  Place.findById(req.params.id).populate('comments').exec((err, found) => {
    if(err) {
      console.log("There was an error: ", err)
    } else {
      res.render("places/show", {place: found})
    }
  })
})

router.post("/", middlewareObj.isLoggedIn, (req, res) => {
  let name = req.body.name
  let url = req.body.url
  let description = req.body.description
  let price = req.body.price
  let author = {
    id: req.user._id, 
    username: req.user.username
  }
  let newPlace = {name: name, price: price, url: url, description: description, author: author}
  Place.create(newPlace, (err, createdPlace) => {
    if(err) {
      console.log("There was an error, here is the error: ", err)
    } else {
      console.log(createdPlace)
      res.redirect("/places")
    }
  })
});

router.get("/:id/edit", middlewareObj.checkPlaceOwnership, (req, res) => {
  Place.findById(req.params.id, (err, foundPlace) => {
    if(err) {
      alert("Place cannot be found!")
      return res.redirect('/places')
    }else{
      res.render("places/edit", {place: foundPlace})
    }
  })
})

router.put("/:id", middlewareObj.checkPlaceOwnership, (req, res) => {
  Place.findByIdAndUpdate(req.params.id, req.body.place, (err, updatedPlace) => {
    if(err) {
      return res.redirect("/places")
    }
    res.redirect("/places/" + req.params.id)
  })
})

router.delete("/:id", middlewareObj.checkPlaceOwnership, (req, res) => {
  Place.findByIdAndRemove(req.params.id, (err, deletedPlace) => {
    if(err) {
      return res.redirect("/places")
    }
    res.redirect("/places")
  })
})

module.exports = router