const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); 
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewere.js")
const reviewControlers = require("../controllers/review.js");

// Review Post route
router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(reviewControlers.createReview)
)

// Delete Review Route
router.delete("/review/Id",isLoggedIn,isReviewAuthor,wrapAsync(reviewControlers.deleteReview));

module.exports = router;