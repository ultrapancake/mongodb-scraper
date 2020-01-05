const request = require("request");
const cheerio = require("cheerio");
var scrape = function(cb) {
  request("https://www.ringtv.com/", function(err, res, body) {
    let $ = cheerio.load(body);
    let articles = [];
    $(".item").each(function(i, element) {
      let head = $(this)
        .children(".text")
        .text()
        .trim();
      //   console.log("Heading: " + i + " " + head);
      let img = $(this)
        .children("a")
        .children("img")
        .attr("src");
      //   console.log("Image: " + i + " " + img);
      let url = $(this)
        .children(".image")
        .attr("href");

      if (head && img) {
        let headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        let dataToAdd = {
          headline: headNeat,
          image: img,
          url: url
        };
        // console.log(dataToAdd);
        articles.push(dataToAdd);
      }
    });
    cb(articles);
  });
};
// scrape();
// call function to test

module.exports = scrape;
