const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const warpAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewere.js");
const listingControlers = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
// const storage = new CloudinaryStorage({  });

const upload = multer({ storage });

// Index Route And Create Route
router
  .route("/")
  .get(warpAsync(listingControlers.Index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    warpAsync(listingControlers.newCreateForm)
  );

// new route
router.get("/new", isLoggedIn, listingControlers.newFormRender);

// Show Route , Delete Route And Update Route
router
  .route("/:id")
  .get(warpAsync(listingControlers.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    warpAsync(listingControlers.updateListing)
  )
  .delete(isLoggedIn, isOwner, warpAsync(listingControlers.deletedListing));

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  warpAsync(listingControlers.editListing)
);

module.exports = router;
