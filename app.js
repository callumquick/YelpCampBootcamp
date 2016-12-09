var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var port = 3000;
var campsites = [{
        name: "Salmon Creek",
        image: "https://images.pexels.com/photos/192518/pexels-photo-192518.jpeg?h=350&auto=compress",
    },{
        name: "Fisherman's Wood",
        image: "https://images.pexels.com/photos/104864/pexels-photo-104864.jpeg?h=350&auto=compress"
    }];

mongoose.connect("mongodb://localhost/yelpcamp");
var campsiteSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});
var Campsite = mongoose.model("Campsite", campsiteSchema); 

app.set("view engine","pug");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", function(req, res){
    res.render("home");
});

app.get("/campsites", function(req, res){
	var campsitesList = [];
	Campsite.find({}, function(err,campsites){
		if(err) {console.log(err)} else {
			campsites.forEach(function(campsite){
				campsitesList.push(campsite);
			});
			res.render("campsites",{
				campsites: campsitesList
			});
		}
	});
});

app.get("/new", function(req,res){
    res.render("new");
});

app.post("/campsites", function(req, res){
    var campsiteObj = req.body;
	Campsite.create({
			name: campsiteObj.name,
			image: campsiteObj.image
		},function(err,campsite){
			if (err) {console.log(err)} else {
				console.log("Successfully created posted campsite.");
			}
	});
    res.redirect("/campsites");
});

app.get("/campsites/:id", function(req, res){
	res.render("show", {campsite: campsites[0]});
});

app.listen(port, function(){
    console.log("Serving YelpCamp on port "+port+".");
});