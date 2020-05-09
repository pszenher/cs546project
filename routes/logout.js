const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if(req.session.user){
    req.session.destroy();
    res.render("users/logout", { logged_in : ((req.session && req.session.user) ? true : false) });
  } else {
    res.render("users/login", { logged_in : ((req.session && req.session.user) ? true : false) });
  }
});
module.exports = router;
