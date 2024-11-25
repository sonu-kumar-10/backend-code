const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE0ODQ2MDI1NTE4MDMzOTQ4MQ%3D%3D/original/c92634d0-4964-439a-905d-b9129af14d34.jpeg?im_w=1200",
  },
  price: {
    type: Number,  // If you're storing a price as a number
    required: true,
  },
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

listingSchema.post("findOneAndDelete" ,async(listing) =>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.review}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;