const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  if (req.session.user) {
    return res.redirect("users/single", { user: req.session.user });
  } else {
    res.render("users/login", { title: "Login Page" });
  }
});

router.post("/", async (req, res) => {
  const userPostData = req.body;
  try {
    let { email, password } = userPostData;
    if (email && password) {
      const newUser = await userData.getUserByEmail(userPostData.email);
      if (newUser == null) {
        res.status(401).send({ error: "Email or password is wrong " });
      }
      passwordMatch = await bcrypt.compare(
        userPostData.password,
        newUser.password
      );
      if (passwordMatch) {
        res.render("users/single", { user: newUser });
        // res.json(newUser);
      } else {
        res.status(401).send({ error: "Email or password is wrong" });
      }
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});

module.exports = router;
