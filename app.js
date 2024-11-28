const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const review = require("./models/review.js");
const listing = require("./routes/listings.js");

const reviewsRoute = require("./routes/review.js");

// Use method-override for handling PUT and DELETE methods in forms
app.use(methodOverride("_method"));

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Use the current directory path to set views and static file locations
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; 


main()
    .then((res) => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err)
    })


//connect mongoose
async function main() {
    await mongoose.connect(MONGO_URL);
}


// Home route
app.get("/", (req, res) => {
  res.send("WELCOME TO HOME PAGE");
});



// Routes for Listing and Review
app.use("/listings", listing);
// app.use("/listings/:id/reviews",review)
app.use("/listings/:id/reviews", reviewsRoute);


// 404 Error Handling
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message)
});

// Start the server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});