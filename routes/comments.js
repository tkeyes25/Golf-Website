var express = require("express");
var router = express.Router({mergeParams: true});
var Campgrounds = require("../models/campground");
var Comments = require("../models/comment");
var middleware = require("../middleware"); // auto requires index.js

// ==================
// COMMENTS ROUTES
// ==================

// NEW comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campgrounds.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE comments
router.post("/", middleware.isLoggedIn, function(req, res) {
    // lookup campground with id
    Campgrounds.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds")
        } else {
            Comments.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong with creating the comment");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment created");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comments.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE comments
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back"); 
        } else {
            req.flash("success", "Comment updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTORY comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comments.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;