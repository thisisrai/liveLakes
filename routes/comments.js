const express = require("express")
const router = express.Router({mergeParams: true})
const Place = require("../models/place")
const Comments = require("../models/comment")
const middlewareObj = require("../middleware")

router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
  Place.findById(req.params.id, (err, place) => {
    if(err) {
      console.log("There was an error: ", err)
    } else {
      res.render("comments/new", {place: place})
    }
  })
})

router.post("/", middlewareObj.isLoggedIn, (req, res) => {
  Place.findById(req.params.id, (err, place) => {
    if (err) {
      console.log("There was an error: ", err)
      alert('There was an error in adding the comment!')
      res.redirect('/places')
    } else {
      Comments.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err)
          alert('There was an error in adding the comment!')
          res.redirect('/places')
        } else {
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save()
          place.comments.push(comment)
          place.save()
          res.redirect("/places/" + req.params.id)
        }
      })
    }
  })
})

router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, (req, res) => {
  Comments.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      res.send("error")
    } else {
      res.render("comments/edit", {place_id: req.params.id, comment: comment} )
    }
  })
})

router.put("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
  Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment ,(err, updatedComment) => {
    console.log(updatedComment)
    res.redirect("/places/" + req.params.id)
  })
})

router.delete("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
  Comments.findByIdAndRemove(req.params.comment_id,(err, deletedComment) => {
    console.log(deletedComment)
    res.redirect("/places/" + req.params.id)
  })
})

module.exports = router 