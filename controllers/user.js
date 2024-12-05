const User = require("../models/user");
module.exports.renderUsersignUpForm =  (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signUp = async (req, res) => {
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
};

module.exports.renderUserlogInForm = (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.successLogin = async (req, res) => {
    req.flash("success", "Welcome To Back Wanderlust App!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

module.exports.renderLogOutForm = (req,res,next) =>{
    req.logout((err) => {
        if(err) {
          return next(err);
        }
        req.flash("success", "You Are Logout Now!");
        res.redirect("/listings")
    })
}