const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if (req.session.user) {
    req.session.destroy();
    res.render("users/logout", { logged_in: false });
  } else {
    res.render("users/login", { logged_in: false });
  }
});
module.exports = router;
