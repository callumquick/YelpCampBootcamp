var mongoose = require("mongoose");
var Campsite = require("./models/campsite.js");

var seedDB = function(){
    Campsite.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed campsites!")
    });
}

module.exports = seedDB;