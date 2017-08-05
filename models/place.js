const mongoose = require("mongoose")

let placeSchema = new mongoose.Schema({
  name: String,
  price: String,  
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

module.exports = mongoose.model("Place", placeSchema)