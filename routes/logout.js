const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if(req.session.user){
    req.session.destroy();
    res.render("users/logout");
  } else {
    res.render("users/login");
  }
});
module.exports = router;
