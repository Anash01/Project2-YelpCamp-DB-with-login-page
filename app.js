var express = require("express");

var app = express();

var bodyParser = require("body-parser");

var mongoose= require("mongoose");

var passport = require("passport");

var LocalStrategy = require("passport-local");

var methodOverride = require("method-override");

var passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user");

// var seedDB = require("./seeds");

// seedDB();

// var campground = require("./models/campground");

mongoose.connect("mongodb://localhost/yelpcamp_app");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(methodOverride("_method"));

var campgroundSchema = new mongoose.Schema({
    name: "String",
    image: "String",
    description: "String"
    // comments: [
    //     {
    //         type: mongoose.Schema.Type.ObjectId,
    //         ref: "Comment"
    //     }
    // ]
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({  
//        name: "mountain hill" ,
//        image: "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtcGdyb3VuZHxlbnwwfHwwfHw%3D&w=1000&q=80",
//        description: "This is a huge granite hill"
//     }, function( err, campground)
// {
//     if(err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         console.log("Newly created campgrounds:");
//         console.log(campground);
//     }
// });


// var campgrounds = [
   
//     { name: "Granite hill" , image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGdyb3VuZHxlbnwwfHwwfHw%3D&w=1000&q=80"},
//     { name: "Mount Greek" , image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/2a/16/86/horsethief-campground.jpg?w=900&h=-1&s=1"},
//     { name: "mountain hill" , image: "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtcGdyb3VuZHxlbnwwfHwwfHw%3D&w=1000&q=80"},
//     { name: "Granite hill" , image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGdyb3VuZHxlbnwwfHwwfHw%3D&w=1000&q=80"},
//     { name: "Mount Greek" , image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/2a/16/86/horsethief-campground.jpg?w=900&h=-1&s=1"},
//     { name: "mountain hill" , image: "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtcGdyb3VuZHxlbnwwfHwwfHw%3D&w=1000&q=80"},
//     { name: "Granite hill" , image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGdyb3VuZHxlbnwwfHwwfHw%3D&w=1000&q=80"},
//     { name: "Mount Greek" , image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/2a/16/86/horsethief-campground.jpg?w=900&h=-1&s=1"},
//     { name: "mountain hill" , image: "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtcGdyb3VuZHxlbnwwfHwwfHw%3D&w=1000&q=80"},
//     { name: "Granite hill" , image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGdyb3VuZHxlbnwwfHwwfHw%3D&w=1000&q=80"},
//     { name: "Mount Greek" , image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/2a/16/86/horsethief-campground.jpg?w=900&h=-1&s=1"}
// ]

app.use(require("express-session")({
    secret: "Once again rusty wins the cutest",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next)
{
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req,res)
{
    res.render("landing");
});

// index campground- show all campground
app.get("/campgrounds", function(req,res)
{
    Campground.find( {}, function(err, allcampground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campground", {campgrounds:allcampground, currentUser: req.user});
        }
    });
});

// create- new campgrounds
app.post("/campgrounds", function(req,res)
{
    var name= req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name , image:image, description:desc}
    // campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, newlyCreated)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
    
});

// new- show form to create new campground
app.get("/campgrounds/new", function(req,res)
{
    res.render("new");
});


app.get("/campgrounds/:id", function(req,res)
{
    Campground.findById(req.params.id, function(err, found)
    {
       if(err)
       {
           console.log(err);
       }
       else
       {
        res.render("show", {campground:found});
       }
    });
    //  res.send("This will be the template page!");
});
      
//auth routes- show register

app.get("/register", function(req, res)
{
    res.render("register");
});

//signup logic

app.post("/register", function(req, res)
{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user)
    {
        if(err)
        {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function()
        {
            res.redirect("/campgrounds");
        });
    });
});

//show login form 

app.get("/login", function(req,res)
{
    res.render("login");
});

//login logic

app.post("/login", passport.authenticate("local",
 {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) , function(req,res)
{
});

app.get("/logout", function(req,res)
{
    req.logout();
    res.redirect("/campgrounds");
});

// edit

app.get("/:id/edit", function(req,res)
{
    res.send("edit campground route");
});

app.listen(3000, function(req,res)
{
    console.log("yelpcamp server is running");
});