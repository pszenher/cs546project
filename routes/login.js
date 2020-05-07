const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const bcrypt = require("bcrypt");
const url = require("url");

router.get("/", async (req, res) => {
  // if logged in, redirect to user's profile
  if (req.session && req.session.user) {
    console.log("why i am i here");
    res.redirect("users/" + req.session.user._id);
  } else {
    console.log("here I am");
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
        req.session.user = newUser;
        res.redirect("users/" + newUser._id);
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
