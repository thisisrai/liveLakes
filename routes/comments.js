const express = require("express")
const router = express.Router({mergeParams: true})
const Lake = require("../models/lake")
const Comments = require("../models/comment")

router.get("/new", isLoggedIn, (req, res) => {
  Lake.findById(req.params.id, (err, lake) => {
    if(err) {
      console.log("There was an error: ", err)
    } else {
      res.render("comments/new", {lake: lake})
    }
  })
})

router.post("/", isLoggedIn, (req, res) => {
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
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save()
          lake.comments.push(comment)
          lake.save()
          res.redirect("/lakes/" + req.params.id)
        }
      })
    }
  })
})

router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
  Comments.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      res.send("error")
    } else {
      res.render("comments/edit", {lake_id: req.params.id, comment: comment} )
    }
  })
})

router.put("/:comment_id", checkCommentOwnership, (req, res) => {
  Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment ,(err, updatedComment) => {
    console.log(updatedComment)
    res.redirect("/lakes/" + req.params.id)
  })
})

router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
  Comments.findByIdAndRemove(req.params.comment_id,(err, deletedComment) => {
    console.log(deletedComment)
    res.redirect("/lakes/" + req.params.id)
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}

function checkCommentOwnership(req, res, next) {
  if(req.isAuthenticated()) {
    Comments.findById(req.params.comment_id, (err, foundComment) => {
      if(err) {
        alert("Comment cannot be found!")
        return res.redirect("back")
      }
      if(foundComment.author.id.equals(req.user._id)) {
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