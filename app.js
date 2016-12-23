var express 	= require("express");
var app 		= express();
var mongoose 	= require("mongoose");
var bodyParser 	= require("body-parser");
var passport	= require("passport");
var LocalStrategy = require("passport-local");
var Campsite 	= require("./models/campsite");
var Comment 	= require("./models/comment");
var User		= require("./models/user")
var seedDB 		= require("./seeds");
var port 		= 3000;

//===============
//DATABASE CONFIG
//===============

seedDB();
mongoose.connect("mongodb://localhost/yelpcamp");

//==============
//EXPRESS CONFIG
//==============

app.set("view engine","pug");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));

//===============
//PASSPORT CONFIG
//===============

app.use(require("express-session")({
	secret: "YelpCamp Super Secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================================================

//User data middleware provider
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//Root route
app.get("/", function(req, res){
    res.render("home");
});

//===============
//CAMPSITE ROUTES
//===============

//Index route
app.get("/campsites", function(req, res){
	Campsite.find({}, function(err,campsites){
		if(err) {console.log(err)} else {
			res.render("campsites/index",{
				campsites: campsites
			});
		}
	});
});

//Create route
app.post("/campsites", function(req, res){
	var campsiteObj = req.body;
	Campsite.create({
			name: campsiteObj.name,
			image: campsiteObj.image,
			description: campsiteObj.description
		},function(err,campsite){
			if (err) {console.log(err)} else {
				console.log("Successfully created posted campsite.");
			}
	});
	res.redirect("/campsites");
});

//New route
app.get("/campsites/new", function(req,res){
	res.render("campsites/new");
});

//Show route
app.get("/campsites/:id", function(req, res){
	Campsite
	.findById(req.params.id)
	.populate("comments")
	.exec(function(err, campsite){
		if (err) {
			console.log(err);
			res.redirect("/campsites");
		} else {
			res.render("campsites/show", {campsite: campsite});
		}
	});
});

//==============
//COMMENT ROUTES
//==============

//New route
app.get("/campsites/:id/comments/new", isLoggedIn, function(req, res){
	Campsite.findById(req.params.id, function(err, campsite){
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campsite: campsite});
		}
	});
});

//Create route
app.post("/campsites/:id/comments", isLoggedIn, function(req, res) {
	Campsite
	.findById(req.params.id, function(err, campsite){
		if (err) {
			console.log(err);
			res.redirect("/campsites");
		} else {
			Comment.create({
			text: req.body.text,
			author: req.body.author
			},function(err,comment){
				if (err) {console.log(err)} else {
					console.log("Successfully created posted comment.");
					campsite.comments.push(comment);
					campsite.save(function(err, campsite){
						var URL = "/campsites/"+campsite._id;
						res.redirect(URL); 
					});
				}
			});
		}
	});
});

//===========
//AUTH ROUTES
//===========

//Register form route
app.get("/register", function(req, res){
	res.render("register");
});

//Sign up post route
app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			res.render("register");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campsites");
		});
	});
});

//GET login form
app.get("/login", function(req, res){
	res.render("login");
});

//Log in post route
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campsites",
		failureRedirect: "/login"
	}), function(req, res){
		
});

//Log out route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campsites");
});

//==========================================================

//Wildcard route
app.get("*", function(req, res){
	res.send("This page is unavailable, please check your URL.");
});

//==========
//MIDDLEWARE
//==========

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//=======
//SERVER
//======

app.listen(port, function(){
	console.log("Serving YelpCamp on port "+port+".");
});