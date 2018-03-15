let express = require("express"); 
let bodyParser = require("body-parser");
let handlebars = require("express-handlebars");
let mongoose = require("mongoose");


//Scraping tools
let cheerio = require("cheerio");
let request = require("request");


//Requiring Models
let db = require("./models");


//set up port 
const PORT = 3000; 


//initialize express 
let app = express(); 


//Body-Parser to handle form submits
app.use(bodyParser.urlencoded({extended: false}));

//express.static to serve as the public folder as a static directory
app.use(express.static("public"));

//Setting up Mongoose to connect to our MongoDB Server

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo-democracy-scraper";

mongoose.Promise = Promise; 
mongoose.connect(MONGODB_URI, {
    //useMongoClient: true 
});



//This makes a request to grab the HTML from the Austin Monitor website. 
request("http://www.austinmonitor.com", function (err, res, html) {
    if (!err && res.statusCode == 200) {

        //$ is shorthand for cheerio | this loads the HTML into cheerio 
        let $ = cheerio.load(html);
       // var a = $(this).prev();

        //this is where we are storing our array of data from AustinMonitor.com 

        let results = [];
        let results2 = [];


        //Grabs information form this particular H1 Tag and places them in variables. 
        $("div.wrapper").each(function (i, element) {

            //elements of the div.wrapper which contains info about all the articles 
            let title = $(element).children('h1').text();
            let link = $(element).children('h1').children('a').attr('href'); 
            let summary = $(element).children('.entry-summary').text(); 
            let dateAuthor = $(element).children('.posted').text(); 
            let category =  $(element).children('.cat-links').text(); 
        
            //pushes it to the results array. 
            results.push({
                title: title,
                link: link,
                summary: summary,
                dateAuthor: dateAuthor,
                cateogry: category
            });

        });

        console.log(results);
        
    }
});

// Start the server
app.listen(PORT, function() {
    console.log("Mongo Democracy Scraper is running on port " + PORT + "!");
  });