const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  geometry: {
    type: {
      type: String,  // This must be 'Point'
      enum: ["Point"],  // Only "Point" type is allowed
      required: true,  // This field is required
    },
    coordinates: {
      type: [Number],  // Array of numbers (longitude, latitude)
      required: true,  // Coordinates are required
    },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing && listing.reviews && listing.reviews.length > 0) {
    const Review = require("./review");  // Importing Review inside the hook to avoid circular dependency
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;