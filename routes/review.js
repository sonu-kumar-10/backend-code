const express = require("express");
const router = express.Router({mergeParams: true});
const warpAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");


// Validation middleware for reviews
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

// Review Post route
router.post("/", validateReview, warpAsync(async (req, res) => {
    console.log(req.params.id)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.review.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("Review saved successfully");
    res.redirect(`/listings/${listing._id}`);
  }));

  // Delete Review route
  router.delete("/:reviewId", warpAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }));

  module.exports = router;