const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const bcrypt = require("bcrypt"); //Importing the NPM bcrypt package.
const salt = 10;
const xss = require("xss");

router.get("/new", async (req, res) => {
  try {
    if (req.session && req.session.user) {
      res.redirect("./" + req.session.user._id);
    } else {
      res.render("users/new", {
        logged_in: false,
        user: null
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.get("/update_pass", async (req, res) => {
  try {
    if (req.session && req.session.user) {
      res.render("users/password", { logged_in: true, user: req.session.user });
    } else {
      res.render("users/new", { logged_in: false, user: null });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.get("/profile", async (req, res) => {
  try {
    if (req.session && req.session.user) {
      res.render("users/profile", { logged_in: true, user: req.session.user });
    } else {
      res.render("users/new", { logged_in: false, user: null });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userData.getUserById(req.params.id);
    user.password = "*****";
    res.render("users/single", {
      user: user,
      logged_in: req.session && req.session.user ? true : false,
      logged_in_user: req.session && req.session.user ? req.session.user : null,
    });
    //res.json(user);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
  }
});

router.get("/", async (req, res) => {
  try {
    const userList = await userData.getAllUsers();
    res.render("users/index", {
      users: userList,
      logged_in: req.session && req.session.user ? true : false,
      user: req.session && req.session.user ? req.session.user : null,
    });
    //res.json(userList);
  } catch (e) {
    // Something went wrong with the server!
    res.status(500).send({ error: e });
  }
});
router.post("/", async (req, res) => {
  const userPostData = req.body;
  try {
    let {
      firstName,
      lastName,
      email,
      gender,
      city,
      state,
      age,
      password,
      bio,
      interested,
    } = userPostData;

    firstName = xss(firstName);
    lastName = xss(lastName);
    email = xss(email);
    gender = xss(gender);
    city = xss(city);
    state = xss(state);
    age = xss(age);
    bio = xss(bio);
    interested = xss(interested);

    if (typeof interested == "string") {
      interested = interested.split();
    }
    if (
      firstName &&
      lastName &&
      email &&
      gender &&
      city &&
      state &&
      age &&
      password &&
      bio &&
      Array.isArray(interested)
    ) {
      const newUser = await userData.addUser(
        firstName,
        lastName,
        email,
        gender,
        city,
        state,
        age,
        password,
        bio,
        interested
      );
      res.render("users/single", {
        user: newUser,
        logged_in: req.session && req.session.user ? true : false,
        logged_in_user: req.session && req.session.user ? req.session.user : null,
      });
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});
router.patch("/:id", async (req, res) => {
  const userPostData = req.body;
  let idFound = await ifUserPresent(req.params.id);
  if (!idFound) {
    res.status(404).send({ error: "Id not Found Request" });
    return;
  }
  try {
    let {
      firstName,
      lastName,
      email,
      gender,
      city,
      state,
      age,
      bio,
      interested,
    } = userPostData;

    firstName = xss(firstName);
    lastName = xss(lastName);
    email = xss(email);
    gender = xss(gender);
    city = xss(city);
    state = xss(state);
    age = xss(age);
    bio = xss(bio);
    interested = xss(interested);

    const updatedUser = await userData.updateUser(
      req.params.id,
      firstName,
      lastName,
      email,
      gender,
      city,
      state,
      age,
      bio,
      interested
    );
    res.json(updatedUser);
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});

router.post("/addSongToPlaylist", async (req, res) => {
  const userPostData = req.body;
  try {
    const id = xss(userPostData.id);
    const songId = xss(userPostData.songId);

    let idFound = await ifUserPresent(id);

    if (!idFound) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    if (id && songId) {
      const user = await userData.addSongToPlaylist(id, songId);
      res.json(user);
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});
router.post("/removeSongFromPlaylist", async (req, res) => {
  const userPostData = req.body;
  try {
    const id = xss(userPostData.id);
    const songId = xss(userPostData.songId);

    let idFound = await ifUserPresent(id);

    if (!idFound) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    if (id && songId) {
      const user = await userData.removeSongFromPlaylist(id, songId);
      res.json(user);
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});
router.post("/addLikedSong", async (req, res) => {
  const userPostData = req.body;
  try {
    const id = xss(userPostData.id);
    const songId = xss(userPostData.songId);

    let idFound = await ifUserPresent(id);

    if (!idFound) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    if (id && songId) {
      const user = await userData.addLikedSong(id, songId);
      res.json(user);
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});
router.post("/removeLikedSong", async (req, res) => {
  const userPostData = req.body;
  try {
    const id = xss(userPostData.id);
    const songId = xss(userPostData.songId);

    let idFound = await ifUserPresent(id);

    if (!idFound) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    if (id && songId) {
      const user = await userData.removeLikedSong(id, songId);
      res.json(user);
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});

router.post("/addDisLikedSong", async (req, res) => {
  const userPostData = req.body;
  try {
    const id = xss(userPostData.id);
    const songId = xss(userPostData.songId);

    let idFound = await ifUserPresent(id);

    if (!idFound) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    if (id && songId) {
      const user = await userData.addDisLikedSong(id, songId);
      res.json(user);
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});
router.post("/removeDisLikedSong", async (req, res) => {
  const userPostData = req.body;
  try {
    const id = xss(userPostData.id);
    const songId = xss(userPostData.songId);

    let idFound = await ifUserPresent(id);

    if (!idFound) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    if (id && songId) {
      const user = await userData.removeDisLikedSong(id, songId);
      res.json(user);
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});

router.post("/addSongToUser", async (req, res) => {
  const userPostData = req.body;
  try {
    const id = xss(userPostData.id);
    const songId = xss(userPostData.songId);

    let idFound = await ifUserPresent(id);

    if (!idFound) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    if (id && songId) {
      const user = await userData.addSongToUser(id, songId);
      res.json(user);
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});
router.post("/removeSongFromUser", async (req, res) => {
  const userPostData = req.body;
  try {
    const id = xss(userPostData.id);
    const songId = xss(userPostData.songId);

    let idFound = await ifUserPresent(id);

    if (!idFound) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    if (id && songId) {
      const user = await userData.removeSongFromUser(id, songId);
      res.json(user);
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});

router.post("/updatePassword", async (req, res) => {
  const userPostData = req.body;
  try {
    const id = xss(userPostData.id);
    const password = userPostData.password;
    const newPass = userPostData.newPass;

    let idFound = await ifUserPresent(id);
    if (!idFound) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    if (id && password) {
      const user = await userData.getUserById(id);
      passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        try {
          const userPassword = await userData.updatePassword(id, newPass);
          res.json({ msg: true });
        } catch (e) {
          res.json({ msg: false, errormsg: "Please Provide new Password" });
        }
      } else {
        res.json({ msg: false, errormsg: "Old pass word is Incorrect" });
      }
    } else {
      res.status(400).send({ error: "Bad Request" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});
router.delete("/:id", async (req, res) => {
  let idFound = await ifUserPresent(req.params.id);
  if (idFound) {
    try {
      const deletedUser = await userData.removeUser(req.params.id);
      res.json(deletedUser);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  } else {
    res.status(404).send({ error: "User not found" });
  }
});

module.exports = router;

async function ifUserPresent(id) {
  try {
    user = await userData.getUserById(id);
    return true;
  } catch (e) {
    return false;
  }
}
