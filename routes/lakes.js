const express = require("express")
const router = express.Router()
const Lake = require("../models/lake")

router.get("/", (req, res) => {
  Lake.find({}, (err, lakes) => {
    if(err) {
      console.log('There was an error: ', err)
    } else {
      res.render("lakes/index", {lakes: lakes})
    }
  })
})

router.get("/new", isLoggedIn, (req, res) => {
  res.render("lakes/new")
})

router.get("/:id", (req, res) => {
  Lake.findById(req.params.id).populate('comments').exec((err, found) => {
    if(err) {
      console.log("There was an error: ", err)
    } else {
      res.render("lakes/show", {lake: found})
    }
  })
})

router.post("/", isLoggedIn, (req, res) => {
  let name = req.body.name
  let url = req.body.url
  let description = req.body.description
  let author = {
    id: req.user._id, 
    username: req.user.username
  }
  let newLake = {name: name, url: url, description: description, author: author}
  Lake.create(newLake, (err, createdLake) => {
    if(err) {
      console.log("There was an error, here is the error: ", err)
    } else {
      console.log(createdLake)
      res.redirect("/lakes")
    }
  })
});

router.get("/:id/edit", checkLakeOwnership, (req, res) => {
  Lake.findById(req.params.id, (err, foundLake) => {
    if(err) {
      alert("Lake cannot be found!")
      return res.redirect('/lakes')
    }else{
      res.render("lakes/edit", {lake: foundLake})
    }
  })
})

router.put("/:id", checkLakeOwnership, (req, res) => {
  Lake.findByIdAndUpdate(req.params.id, req.body.lake, (err, updatedLake) => {
    if(err) {
      return res.redirect("/lakes")
    }
    res.redirect("/lakes/" + req.params.id)
  })
})

router.delete("/:id", checkLakeOwnership, (req, res) => {
  Lake.findByIdAndRemove(req.params.id, (err, deletedLake) => {
    if(err) {
      return res.redirect("/lakes")
    }
    res.redirect("/lakes")
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}

function checkLakeOwnership(req, res, next) {
  if(req.isAuthenticated()) {
    Lake.findById(req.params.id, (err, foundLake) => {
      if(err) {
        alert("Lake cannot be found!")
        return res.redirect("back")
      }
      if(foundLake.author.id.equals(req.user._id)) {
        next()
      } else {
        res.redirect("back")
      }
    })
  } else {
    res.redirect("back")
  }
}

module.exports = router