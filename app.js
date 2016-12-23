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

//Route dependencies
var campsiteRoutes 	= require("./routes/campsites"),
	commentRoutes 	= require("./routes/comments"),
	indexRoutes 	= require("./routes/index");

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

//======
//ROUTES
//======

app.use("/campsites/:id/comments", commentRoutes);
app.use("/campsites", campsiteRoutes);
app.use("/", indexRoutes);

//=======
//SERVER
//======

app.listen(port, function(){
	console.log("Serving YelpCamp on port "+port+".");
});