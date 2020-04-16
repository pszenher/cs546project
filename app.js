const express = require("express");
const exphbs = require('express-handlebars');
const app = express();
const configRoutes = require("./routes");

app.use("/",express.static(__dirname + '/layouts'));

app.get("/",(req,res) => {
    res.sendFile(path.resolve("/layouts/index.html"));
});

app.use(express.json())
app.use(express.urlencoded({ extended:true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});