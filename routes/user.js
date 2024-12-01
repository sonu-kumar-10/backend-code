const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewere");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    try {
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) =>{
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome To Register Page");
            res.redirect("/listings");
        })
        
    } catch (err) {
        console.error(err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));
router.get("/login", (req,res) =>{
    res.render("users/login.ejs");
})

router.post('/login',saveRedirectUrl, 
    passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }),
    function(req, res) {
      req.flash("success", "Welcome To Back Wanderlust App!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    });

router.get("/logout", (req,res,next) =>{
    req.logout((err) => {
        if(err) {
          return next(err);
        }
        req.flash("success", "You Are Logout Now!");
        res.redirect("/listings")
    })
})
module.exports = router;