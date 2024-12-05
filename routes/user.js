const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewere");
const userContolers = require("../controllers/user");

//SignUp fanctionalty
router
  .route("/signup")
  .get(userContolers.renderUsersignUpForm)
  .post(wrapAsync(userContolers.signUp));

//Login fanctionalty
router
  .route("/login")
  .get(userContolers.renderUserlogInForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userContolers.successLogin
  );

router.get("/logout", userContolers.renderLogOutForm);
module.exports = router;
