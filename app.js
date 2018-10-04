var express          = require("express"),
    app              = express(),
    parser           = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    localStrategy    = require("passport-local"),
    methodOverride  = require("method-override"),
    user             = require("./models/user"),
    Campgrounds      = require("./models/campground"),
    Comments         = require("./models/comment"),
    seedDB           = require("./seeds"),
    flash            = require("connect-flash");
    
// requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(parser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
// Seed DB
// seedDB();

// passport config
app.use(require("express-session")({
    secret: "Bono is the man",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    // flash messages
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp server has started");
});