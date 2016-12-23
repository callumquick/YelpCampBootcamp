var express 	= require("express");
var app 		= express();
var mongoose 	= require("mongoose");
var bodyParser 	= require("body-parser");
var Campsite 	= require("./models/campsite");
var Comment 	= require("./models/comment.js");
var seedDB 		= require("./seeds.js");
var port 		= 3000;

seedDB();
mongoose.connect("mongodb://localhost/yelpcamp");

app.set("view engine","pug");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));

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

//===============
//COMMENT ROUTES
//===============

//New route
app.get("/campsites/:id/comments/new", function(req, res){
	Campsite.findById(req.params.id, function(err, campsite){
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campsite: campsite});
		}
	});
});

//Create route
app.post("/campsites/:id/comments", function(req, res) {
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

//Wildcard route
app.get("*", function(req, res){
	res.send("This page is unavailable, please check your URL.");
});

app.listen(port, function(){
	console.log("Serving YelpCamp on port "+port+".");
});