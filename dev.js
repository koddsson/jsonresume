const express = require("express");
const fs = require("fs");
const mustache = require("mustache");

const app = express();

const file = process.argv[2] || "stebbib.json";

app.get("/", function(req, res) {
  fs.readFile("./themes/resume.template", (templateError, template) => {
    fs.readFile(`./test_documents/${file}`, (err, data) => {
      const renderedData = mustache.render(
        template.toString(),
        JSON.parse(data.toString())
      );
      res.send(renderedData);
    });
  });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
