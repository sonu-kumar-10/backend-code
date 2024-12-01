const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const warpAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,isOwner,validateListing } = require("../middlewere.js");
const listingControlers = require("../controllers/listing.js");



// index route
router.get("/", warpAsync(listingControlers.Index));

// new route
router.get("/new", isLoggedIn,listingControlers.newFormRender);

// show route
router.get("/:id", warpAsync(listingControlers.showListing));

// create route
router.post("/", isLoggedIn,validateListing, warpAsync(listingControlers.newCreateForm));

// edit route
router.get("/:id/edit",isLoggedIn, isOwner,warpAsync(listingControlers.editListing));

// delete route
router.delete("/:id",isLoggedIn, isOwner,warpAsync(listingControlers.deletedListing));

// update route
router.put("/:id",isLoggedIn, isOwner, validateListing, warpAsync(listingControlers.updateListing));

module.exports = router;