const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  req.session.destroy();
  // res.send('You have been Logged out');
  res.redirect("login");
});
module.exports = router;
