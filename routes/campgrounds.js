var express = require("express");
var router = express.Router();
var Campgrounds = require("../models/campground");
var middleware = require("../middleware"); // auto requires index.js

// INDEX - show all campgrounds
router.get("/", function (req, res) {
    Campgrounds.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// CREATE - create new campground
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form and add to array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: name,
        price: price, 
        image: image,
        description: desc,
        author: author
    };
    Campgrounds.create(newCampground, function(err, newlyCreated) {
        if (err) {
            req.flash("error", "Had trouble creating crampground");
            console.log(err);
        } else {
            req.flash("success", "Campground created");
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - shows more info on one campground
router.get("/:id", function(req, res) {
    // find campground with provided id
    Campgrounds.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    if (req.isAuthenticated()) {
        Campgrounds.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});
            }
        });
    }
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    //find and update correct campground 
    Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campgrounds.findByIdAndRemove(req.params.id, function(err, deletedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;