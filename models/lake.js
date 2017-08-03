const mongoose = require("mongoose")

let lakeSchema = new mongoose.Schema({
  name: String, 
  url: String, 
  description: String, 
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    }, 
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Comment"
    }
  ]
})

module.exports = mongoose.model("Lake", lakeSchema)