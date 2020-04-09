const commentRoutes = require("./comments");
const userRoutes = require("./users");
const songRoutes = require("./songs")
const constructorMethod = app => {
  app.use("/comments", commentRoutes);
  app.use("/users", userRoutes);
  app.use("/songs", songRoutes)

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = constructorMethod;

