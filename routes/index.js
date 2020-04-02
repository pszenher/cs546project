const commentRoutes = require("./comments");

const constructorMethod = app => {
  app.use("/comments", commentRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = constructorMethod;

