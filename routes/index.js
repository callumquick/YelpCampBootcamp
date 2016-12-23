var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");

//Root route
router.get("/", function(req, res){
    res.render("home");
});

//===========
//AUTH ROUTES
//===========

//Register form route
router.get("/register", function(req, res){
	res.render("register");
});

//Sign up post route
router.post("/register", function(req, res){
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
router.get("/login", function(req, res){
	res.render("login");
});

//Log in post route
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campsites",
		failureRedirect: "/login"
	}), function(req, res){
		
});

//Log out route
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campsites");
});

//==========================================================

//Wildcard route
router.get("*", function(req, res){
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

module.exports = router;