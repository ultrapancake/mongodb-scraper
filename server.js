const express = require("express");
const expressHandlebars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const app = express();

const router = express.Router();

//require our routes
require("./config/routes")(router);

app.use(express.static(__dirname + "/public"));

//link handlebars and express app
app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//set up bodyParser
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(router);

//Mongoose  either deployed DB or local mongoHeadlines databse
const db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(db, function(error) {
  if (error) {
    console.log(error);
  } else {
    console.log("mongoose connection is successful");
  }
});

//Listen to the established port and tell me in a console log
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});
