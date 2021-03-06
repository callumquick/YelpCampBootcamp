var express = require("express");
var router = express.Router({mergeParams: true});
var Campsite = require("../models/campsite");
var Comment = require("../models/comment");

//==============
//COMMENT ROUTES
//==============

//New route
router.get("/new", isLoggedIn, function(req, res){
	Campsite.findById(req.params.id, function(err, campsite){
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campsite: campsite});
		}
	});
});

//Create route
router.post("/", isLoggedIn, function(req, res) {
	Campsite
	.findById(req.params.id, function(err, campsite){
		if (err) {
			console.log(err);
			res.redirect("/campsites");
		} else {
			Comment.create({
			text: req.body.text
			},function(err,comment){
				if (err) {console.log(err)} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
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

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;