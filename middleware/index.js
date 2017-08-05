const Place = require("../models/place")
const Comments = require("../models/comment")
const middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  req.flash("error", "Please log in first!")
  res.redirect("/login")
}

middlewareObj.checkPlaceOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
    Place.findById(req.params.id, (err, foundPlace) => {
      if(err) {
        req.flash("error", "Place not found!")
        return res.redirect("back")
      }
      if(foundPlace.author.id.equals(req.user._id) || req.user._id == "5986068919792e0b29d6cdbc") {
        next()
      } else {
        req.flash("error", "You don't have permission for this!")
        res.redirect("back")
      }
    })
  } else {
    res.redirect("back")
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
    Comments.findById(req.params.comment_id, (err, foundComment) => {
      if(err) {
        alert("Comment cannot be found!")
        return res.redirect("back")
      }
      if(foundComment.author.id.equals(req.user._id) || req.user._id == "5986068919792e0b29d6cdbc") {
        next()
      } else {
        req.flash("error", "You don't have permission for this!")
        res.redirect("back")
      }
    })
  } else {
    res.redirect("back")
  }
}

module.exports = middlewareObj