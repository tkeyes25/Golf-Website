var express = require("express");
var router = express.Router();
var user = require("../models/user");
var passport = require("passport");

// ===========
// AUTH
// ===========

router.get("/", function(req, res) {
    res.render("landing");
});

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new user({username: req.body.username});
    user.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to KnoxGolf " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res) {
});

// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/login");
});

module.exports = router;