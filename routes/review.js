const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); 

// Validation middleware for reviews
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// // Review Post route
// router.post(
//   "/",
//   validateReview,
//   wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       throw new ExpressError(404, "Listing not found");
//     }

//     let newReview = new Review(req.body.review);
//     listing.review.push(newReview);

//     await newReview.save();
//     await listing.save();

//     console.log("Review saved successfully");
//     res.redirect(`/listings/${listing._id}`); 
//   })
// );

// Review Post route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req,res)=>{
      let {id}=req.params;
      console.log(id);
      let listing=await Listing.findById(id);
      console.log(listing);
      let newReview=new Review(req.body.review);
      listing.reviews.push(newReview);
      await listing.save();
      await newReview.save();
      console.log(newReview);
      console.log("new Review saved");
      res.redirect(`/listings/${id}`);
})
)

// Delete Review route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    let listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    console.log("Review deleted successfully");
    res.redirect(`/listings/${id}`); 
  })
);

module.exports = router;