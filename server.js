const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const app = express();

const router = express.Router();

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

//Listen to the established port and tell me in a console log
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});
