var express = require("express");
var router = express.Router({mergeParams: true});
var Campsite = require("../models/campsite");
var Comment = require("../models/comment");

//===============
//CAMPSITE ROUTES
//===============

//Index route
router.get("/", function(req, res){
	Campsite.find({}, function(err,campsites){
		if(err) {console.log(err)} else {
			res.render("campsites/index",{
				campsites: campsites
			});
		}
	});
});

//Create route
router.post("/", isLoggedIn, function(req, res){
	var campsiteObj = req.body;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	Campsite.create({
			name: campsiteObj.name,
			image: campsiteObj.image,
			description: campsiteObj.description,
			author: author
		},function(err,campsite){
			if (err) {console.log(err)} else {
				console.log("Successfully created posted campsite.");
			}
	});
	res.redirect("/campsites");
});

//New route
router.get("/new", isLoggedIn, function(req,res){
	res.render("campsites/new");
});

//Show route
router.get("/:id", function(req, res){
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