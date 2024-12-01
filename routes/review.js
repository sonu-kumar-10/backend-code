const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); 
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewere.js")


// Review Post route
router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(async (req,res)=>{
      let {id} = req.params;
      let listing = await Listing.findById(id);
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      listing.reviews.push(newReview);
      await listing.save();
      await newReview.save();
      req.flash("success", "Review Created");
      res.redirect(`/listings/${id}`);
})
)

// Delete Review route
router.delete(
  "/:reviewId", isLoggedIn, isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    let listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    // Remove the review from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    req.flash("danger", "Review Deleted");
    res.redirect(`/listings/${id}`);  // Corrected URL format
  })
);

module.exports = router;