const commentRoutes = require("./comments");
const userRoutes = require("./users");
const songRoutes = require("./songs");
const loginRoutes = require("./login");
const logoutRoutes = require("./logout");
const constructorMethod = (app) => {
  app.use("/comments", commentRoutes);
  app.use("/users", userRoutes);
  app.use("/songs", songRoutes);
  app.use("/login", loginRoutes);
  app.use("/logout", logoutRoutes);

  // app.use("/home", (req, res) => {
  //   res.render("layouts/home",{ logged_in: ((req.session && req.session.user) ? true : false) });
  // });

  app.use("*", (req, res) => {
    res.redirect("/songs");
    //res.status(404).json({ error: "Page not found" });
  });
};

module.exports = constructorMethod;
