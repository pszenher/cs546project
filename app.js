const express = require("express");
const exphbs = require('express-handlebars');
const app = express();
const configRoutes = require("./routes");
const path = require("path");
const static = express.static(__dirname + '/public');

app.use("/",static);

/*
app.get("/",(req,res) => {
    res.sendFile(path.resolve("./static/index.html"));
});
*/

app.use(express.json())
app.use(express.urlencoded({ extended:true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});