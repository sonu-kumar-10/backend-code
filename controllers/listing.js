const { query } = require("express");
const Listing = require("../models/listing.js");
// const nbxGeocoding = require('@maptiler/sdk/services/geocoding')
// const accessMapkey = process.env.MAP_KEY;
// const geocodingClient = nbxGeocoding({ MAP_KEY: accessMapkey})
module.exports.Index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listing/index1.ejs", { allListings });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.newFormRender = (req,res) =>{
    res.render('listing/new.ejs')
  };

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: { path: "author"}}).populate("owner"); // Populate reviews
    if(!listing) {
      req.flash("error", "Listing You Requested For Don't Exit!");
      res.redirect("/listings")
    }
    res.render("listing/show.ejs",{listing})
    // console.log(listing)
  };

module.exports.newCreateForm = async (req, res,next) => {
    // let responce = await geocodingClient
    // .forwordGeocode({
    //   query: "Bihar,India",
    //   limit: 1,
    // })
    // .send()
    // console.log(responce)
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    await newlisting.save();
    req.flash("success", "New Listing Created");  // Add flash message
    res.redirect("/listings");
};

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing You Requested For Don't Exit!");
      res.redirect("/listings")
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/h_300,w_250")
    res.render("listing/edit.ejs",{listing, originalImage})
};

module.exports.deletedListing = async (req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("danger", "Listing Deleted");
    res.redirect("/listings")
  };

module.exports.updateListing = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);  // Corrected string format
  }