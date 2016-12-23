var mongoose = require("mongoose");
var Campsite = require("./models/campsite.js");
var Comment = require("./models/comment.js");

var data = [
    {
        name: "Eagle's Nest",
        image: "https://images.pexels.com/photos/213703/pexels-photo-213703.jpeg?h=350&auto=compress&cs=tinysrgb",
        description: "Great place for watching eagles I guess, but they tend to cover your tent in loads of bird shit."
    },
    {
        name: "Trout's Palace",
        image: "https://images.pexels.com/photos/29818/pexels-photo-29818.jpg?h=350&auto=compress",
        description: "Great place for catching trout I guess, but they tend to slip out your hands and nip your pecker." 
    },
    {
        name: "Martin's Haunt",
        image: "https://images.pexels.com/photos/26559/pexels-photo-26559.jpg?h=350&auto=compress",
        description: "Great place for snatching martins I guess, but they tend to nibble through your tent while you sleep."
    }
];

var seedDB = function(){
    Campsite.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        Comment.remove({}, function(err) {
            if(err) {
                console.log(err);
            }
        });
        console.log("Removed campsites and comments!")
        // data.forEach(function(seed){
        //     Campsite.create(seed, function(err, campsite){
        //         if(err) {
        //             console.log(err);
        //         } else {
        //             console.log("Created campsite: "+campsite.name);
        //             Comment.create({
        //                 text: campsite.name + " is OK I guess.",
        //                 author: "Guy at " + campsite.name
        //             }, function(err, comment){
        //                 if (err) {
        //                     console.log(err)
        //                 } else {
        //                     campsite.comments.push(comment);
        //                     campsite.save();
        //                     console.log("Created new comment by: " + comment.author);
        //                 }
        //             });
        //         }
        //     });
        // });
    });
}

module.exports = seedDB;