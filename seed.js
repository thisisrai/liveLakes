const mongoose = require("mongoose")
const Lake = require("./models/lake")
const Comment = require("./models/comment")

const data = [
  { 
    name : "Lake Chabot", 
    url : "http://www.timfiebig.com/uploads/agent-1/CV%20lake%20chabot.jpg", 
    description: "A great place to take friends and family for a walk"
  }, 
  { 
    name : "Freemont Lake", 
    url : "http://www.visitpinedale.org/cache/made/images/lakes/fremont-lake/upper-fremont-lake_760_506_76auto.jpg", 
    description: "Nice lake."
  }, 
  { name : "Lake Merrit", 
    url : "https://s-media-cache-ak0.pinimg.com/originals/ce/a3/6d/cea36d4036a6fd344411229a53a7a0e8.jpg",
    description: "Lots of people running around it, it's beautiful." 
  },
  { name : "Lake Anza", 
    url : "https://3hm4vx15otpx2n5mp13bqbsk-wpengine.netdna-ssl.com/wp-content/uploads/2015/05/lake-anza-1-590x461.jpg", 
    description : "Very nice, lots of people having picnics here, family friendly."
  }
]

function seedsDB () {
  Lake.remove({}, (err) => {
    // if (err) {
    //   console.log(err)
    // } else {
    //   console.log('Removed lakes!')
    //   data.forEach(data => {
    //     Lake.create(data, (err, created) => {
    //       if (err) {
    //         console.log(err)
    //       } else {
    //         console.log('created new lake!')
    //         Comment.create(
    //           {
    //             text: "This is a great lake!!!", 
    //             author: "Rai Lee"
    //           }, (err, comment) => {
    //             if (err) {
    //               console.log(err)
    //             } else {
    //               created.comments.push(comment)
    //               created.save()
    //               console.log("created new comment")
    //             }
    //           }
    //         )
    //       }
    //     })
    //   })
    // }
  })
}

module.exports = seedsDB 