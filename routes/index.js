// Grab the headlines as a json
const path = require('path');
const express = require('express');
// const exphbs = require('express-handlebars');

const app = express();

// app.engine('.hbs', exphbs({
//   defaultLayout: 'main',
//   extname: '.hbs',
//   layoutsDir: path.join(__dirname, 'views/layouts')
// }));
// app.set('view engine', '.hbs');
// app.set('views', path.join(__dirname, 'views'));

// // now that handlebars is configured,
// // configure all our routes on this app object
// require('./app/index')(app);




$.getJSON("/headlines", function(data) {
    // For each one
    for (var i = 0; i < 10; i++) {
      // Display the apropos information on the page
      $("#headlines").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p><a href='http://www.austinmonitor.com' class='btn-large waves-effect waves-light purple'>Visit the Austin Monitor</a>");


      

    }
  });
  
  
  //Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    console.log("DOE STHIS WORK!??!?!?!"); 
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the headline
    $.ajax({
      method: "GET",
      url: "/headlines/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the headline
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the headline saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the headline
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
//   $(document).on("click", "#savenote", function() {
//     // Grab the id associated with the headline from the submit button
//     var thisId = $(this).attr("data-id");
  
//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//       method: "POST",
//       url: "/headlines/" + thisId,
//       data: {
//         // Value taken from title input
//         title: $("#titleinput").val(),
//         // Value taken from note textarea
//         body: $("#bodyinput").val()
//       }
//     })
//       // With that done
//       .then(function(data) {
//         // Log the response
//         console.log(data);
//         // Empty the notes section
//         $("#notes").empty();
//       });
  
//     // Also, remove the values entered in the input and textarea for note entry
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
//   });
  