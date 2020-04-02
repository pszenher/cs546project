const constructorMethod = app => {
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = constructorMethod;

