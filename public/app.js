// // Grab the headlines as a json
// const path = require('path');
// const express = require('express');
// // const exphbs = require('express-handlebars');

// const app = express();

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

$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('select').material_select();
  $('.modal').modal();
  $(".button-collapse").sideNav();
});




$.getJSON("/headlines", function(data) {
    // For each one
    for (var i = 0; i < 3; i++) {
      // Display the apropos information on the page
      $("#headlines").append(" <div class='col s9'><p data-id='" + data[i]._id + "'><b>" + data[i].title +"</b><br />" +data[i].dateAuthor +"<br />" + data[i].link + "<br /> <br></p></div>" );
    //  "<div class='col s3'><button class='btn-large waves-effect waves-light purple peanut' id=noteButton> Make a Note</a></div>");


    

    }
  });
  
  
  //Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section

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
        $('#modal1').modal('open');
        $("#notes").append("<h3>Your Note for: " + data.title + "</h3>"+
         "<p>Insert your note title below: </p><input id='titleinput' name='title' >"+
        "<p>Insert your note below: </p><textarea id='bodyinput' name='body'></textarea>"+
        "<button btn-large waves-effect waves-light pink data-id='" + data._id + "' id='savenote'>Save Note</button>");
       // "<div id='modal1' data-id='" + data.id +"class='modal'><div class='modal-content'><h4>Notes</h4><p>Note Title<p><input id='titleinput' name='title'></input><p>Note: </p><input id='bodyinput' name='body'></textarea></div><div class='modal-footer'><a href='#!' class='modal-action modal-close waves-effect waves-green btn-flat'>Save Note</a></div>"
         

        

        
  
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
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the headline from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/headlines/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  

