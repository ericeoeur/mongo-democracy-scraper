let express = require("express");
let bodyParser = require("body-parser");
//let exphbs = require("express-handlebars");
let mongoose = require("mongoose");
var path = require('path');



//Scraping tools
let cheerio = require("cheerio");
let request = require("request");


//Requiring Models
let db = require("./models");


//set up port 
const PORT = 3000;


//initialize express 
let app = express();

//set up handlebars


// var exphbs = require('express-handlebars').create({
//     layoutsDir: path.join(__dirname, "views/layouts"),
//     defaultLayout: 'main',
//     extname: 'hbs'
//   });
  
//   app.engine('exphbs', exphbs.engine);
//   app.set('view engine', 'exphbs');
//   app.set('views', path.join(__dirname, "views"));
  

  


// app.engine('exphbs', exphbs({extname: 'exhbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts'  }));
// app.set('view engine', 'exphbs');


//Body-Parser to handle form submits
app.use(bodyParser.urlencoded({
    extended: false
}));

//express.static to serve as the public folder as a static directory
app.use(express.static("public"));

//Setting up Mongoose to connect to our MongoDB Server

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo-democracy-scraper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});

app.get('/', function(req, res){
    res.render('index');
  });


app.get("/scrape", function (req, res) {

    //This makes a request to grab the HTML from the Austin Monitor website. 
    request("http://www.austinmonitor.com", function (err, response, html) {
        if (!err && response.statusCode == 200) {

            //$ is shorthand for cheerio | this loads the HTML into cheerio 
            let $ = cheerio.load(html);

            //this is where we are storing our array of data from AustinMonitor.com 
            let results = [];

            //Grabs information form this particular H1 Tag and places them in variables. 
            $("div.wrapper").each(function (i, element) {

                //elements of the div.wrapper which contains info about all the articles 
                let title = $(element).children('h1').text();
                let link = $(element).children('h1').children('a').attr('href');
                let summary = $(element).children('.entry-summary').text();
                let dateAuthor = $(element).children('.posted').text();
                let category = $(element).children('.cat-links').text();

                //pushes it to the results array. 
                results.push({
                    title: title,
                    link: link,
                    summary: summary,
                    dateAuthor: dateAuthor,
                    category: category
                });

                db.Headline.create(results).then(function (dbHeadline) { //this is not working bc we need to define our models
                        console.log(dbHeadline);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });

            });

            res.send("Scraping is complete!");

            console.log(results);

        }

    });

});


//show all headlines in the API
app.get("/headlines", function (req, res){
    db.Headline.find({})
        .then(function(dbHeadline){
            res.json(dbHeadline);
        })
        .catch(function(err){
            res.json(err);
        }); 
});



// Route for grabbing a specific Article by id, populate it with it's note
app.get("/headlines/:id", function(req, res) {

    db.Headline.findById(req.params.id).populate('note').then(a=>res.json(a)) //use find by ID
    
     // TODO
     // ====
     // Finish the route so it finds one article using the req.params.id,
     // and run the populate method with "note",
     // then responds with the article with the note included
   });
   
   // Route for saving/updating an Article's associated Note
   app.post("/headlines/:id", function(req, res) {
   
   
   
     db.Note.create(req.body).then(function(dbNote){
       return db.Headline.findOneAndUpdate({_id: req.params.id}, { $set: { note: dbNote._id } }, { new: true})
       .then(a=>res.json(a))
       // .then(function(dbArticle){
       //   res.json(dbArticle);
       // });
       
   
     // if(article.note){
     // db.Article.findById(req.params.id).then(function(article){
     //   db.Note.findOneAndUpdate({_id:article.note}, {$set:{req.body}})
     // }
     // })
       
   
     // TODO
     // ====
     // save the new note that gets posted to the Notes collection
     // then find an article from the req.params.id
     // and update it's "note" property with the _id of the new note
   });
   });





// Start the server
app.listen(PORT, function () {
    console.log("Mongo Democracy Scraper is running on port " + PORT + "!");
});