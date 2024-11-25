const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const warpAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

const validateListing = (req,res,next) =>{
    let { error} = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",")
      throw new ExpressError(400, errMsg);
    }else {
      next()
    }
  }

// index route
router.get("/", warpAsync(async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listing/index1.ejs", { allListings });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));

// new route

router.get("/new",(req,res) =>{
  res.render('listing/new.ejs')
});

//show route
router.get("/:id", warpAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("review");
    res.render("listing/show.ejs",{listing})
}));

//create route
router.post("/",validateListing, warpAsync(async (req,res,next) =>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
      throw new ExpressError(400, result.error);
    }
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings")
}))

//edit route

router.get("/:id/edit",warpAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{listing})
}))

//Delete route

router.delete("/:id", warpAsync(async (req,res) =>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings")
}))


// update route
router.put("/:id",validateListing, warpAsync(async (req,res) =>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`)
}));

module.exports = router;