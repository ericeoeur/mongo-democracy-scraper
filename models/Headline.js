let mongoose = require("mongoose");

//save a reference to the Schema constructor 
let Schema = mongoose.Schema; 


//create a new Schema object

let HeadlineSchema = new Schema({

    title: {
        type: String, 
        required: true 
    },
    link: {
        type: String, 
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    dateAuthor: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"

    }

}); 

let Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline; 

