const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();

const router = express.Router();

app.use(express.static(__dirname + "/public"));

app.use(router);

//Listen to the established port and tell me in a console log
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});
