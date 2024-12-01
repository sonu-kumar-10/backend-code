const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const review = require("./models/review.js");
const listing = require("./routes/listings.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

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

const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAvg: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

// Home route
app.get("/", (req, res) => {
  res.send("Welcome To Home Page");
});


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.danger = req.flash("danger");
  res.locals.currUser = req.user;
  next()
})

// app.get("/registerDemo" , async (req, res) =>{
//   let fakeUser = new User({
//     email: "Ram@gmail.com",
//     username: "Ram-thakur"
//   });
//   let registerUser = await User.register(fakeUser, "helloworld");
//   res.send(registerUser)
// })
// Routes for Listing and Review
app.use("/listings", listing);
// app.use("/listings/:id/reviews",review)
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/",userRoute)


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