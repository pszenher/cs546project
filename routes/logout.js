const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  req.session.destroy();
  // res.send('You have been Logged out');
  res.render("users/login", { title: "Login Page" });
});
module.exports = router;
