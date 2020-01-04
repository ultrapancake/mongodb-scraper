const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const headlineSchema = new Schema({
  headline: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  date: String,
  saved: {
    type: Boolean,
    default: false
  }
});

const Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;
