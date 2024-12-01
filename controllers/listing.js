const Listing = require("../models/listing.js");

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
    console.log(listing)
  };

module.exports.newCreateForm = async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
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
    res.render("listing/edit.ejs",{listing})
};

module.exports.deletedListing = async (req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("danger", "Listing Deleted");
    res.redirect("/listings")
  };

module.exports.updateListing = async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);  // Corrected string format
  }