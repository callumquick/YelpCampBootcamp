var express 	= require("express");
var app 		= express();
var mongoose 	= require("mongoose");
var bodyParser 	= require("body-parser");
var Campsite 	= require("./models/campsite");
var seedDB 		= require("./seeds.js");
var port 		= 3000;

seedDB();
mongoose.connect("mongodb://localhost/yelpcamp");

app.set("view engine","pug");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", function(req, res){
    res.render("home");
});

app.get("/campsites", function(req, res){
	Campsite.find({}, function(err,campsites){
		if(err) {console.log(err)} else {
			res.render("campsites",{
				campsites: campsites
			});
		}
	});
});

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

app.get("/campsites/new", function(req,res){
	res.render("new");
});

app.get("/campsites/:id", function(req, res){
	Campsite.findById(req.params.id, function(err, campsite){
		if (err) {
			console.log(err);
			res.redirect("/campsites");
		} else {
			res.render("show", {campsite: campsite});
		}
	});
});
  
app.get("*", function(req, res){
	res.send("This page is unavailable, please check your URL.");
});

app.listen(port, function(){
	console.log("Serving YelpCamp on port "+port+".");
});