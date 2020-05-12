const express = require("express");
var bodyParser = require("body-parser");
const mongoCollections = require("../config/mongoCollections");
const files = mongoCollections.files;
const router = express.Router();
const data = require("../data");
const songData = data.songs;
const userData = data.users;
const commentData = data.comments;
const { ObjectId } = require("mongodb");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const xss = require("xss");

// Use existing mongo connection for GridFS
const mongoConnection = require("../config/mongoConnection");

// Create a storage object with a given configuration
const storage = new GridFsStorage({ db: mongoConnection() });

// Set multer storage engine to the newly created object
const upload = multer({ storage });

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/new", async (req, res) => {
  try {
    if (req.session && req.session.user) {
      let user = await userData.getUserById(req.session.user._id);
      res.render("songs/new", {
        user: user,
        logged_in: req.session && req.session.user ? true : false,
      });
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// songs uploaded by a specific user with this
router.get("/user/:id", async (req,res) => {
  try {
    console.log("reached user/id");
    const user = await userData.getUserById(req.params.id);
    if(user != undefined) {
      let songList = await songData.getSongByUser(req.params.id);
      let user = null;
      for (let song of songList) {
        user = await userData.getUserById(song.author);
        song.artistName = user.firstName + " " + user.lastName;
      }
      res.render("songs/index", {
        songs: songList,
        logged_in: true
      });
    } else {
      res.status(500).json("error: user does not exist");
    }
  } catch (e) {
    res.status(500).json("error: no songs by this user");
  }
});

router.get("/uploaded", async (req, res) => {
  try {
    if (req.session.user == undefined) {
      res.render("users/login");
      return;
    }

    let songList = await songData.getSongByUser(req.session.user._id);
    let user = null;
    for (let song of songList) {
      user = await userData.getUserById(song.author);
      song.artistName = user.firstName + " " + user.lastName;
    }
    if (req.session.user == undefined) {
      res.render("songs/index", {
        songs: songList,
        logged_in: false,
        // users: await songData.getUsersBySongs(songList)
      });
    } else {
      res.render("songs/index", {
        songs: songList,
        logged_in: true,
        // users: await songData.getUsersBySongs(songList)
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const song = await songData.getSongById(req.params.id);

    const fileObjId = song.file;

    const songFile = await songData.getSongMeta(fileObjId);
    const fileDataArr = await songData.getSongFile(fileObjId);

    const url =
      "data:" +
      songFile.contentType +
      ";charset=utf-8;base64," +
      (await fileDataArr.join(""));
    song._url = url;

    let commentIds = song.comment_id;
    let comments = [];
    for (let x = 0; x < commentIds.length; x++) {
      comments[x] = await commentData.getCommentById(commentIds[x]);
    }

    if (req.session.user == undefined) {
      res.render("songs/single", {
        song: song,
        comments: comments,
        logged_in: false,
        user: await userData.getUserById(song.author)
      });
    } else {
      res.render("songs/single", {
        song: song,
        comments: comments,
        logged_in: true,
        user: await userData.getUserById(song.author)
      });
    }
  } catch (e) {
    console.log(e);
  }
});
router.get("/url/:id", async (req, res) => {
  try {
    const song = await songData.getSongById(req.params.id);
    const fileObjId = song.file;
    const songFile = await songData.getSongMeta(fileObjId);
    const fileDataArr = await songData.getSongFile(fileObjId);

    const url =
      "data:" +
      songFile.contentType +
      ";charset=utf-8;base64," +
      (await fileDataArr.join(""));
    song._url = url;
    res.json(song);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get("/", async (req, res) => {
  try {
    let songList = await songData.getAllSongs();
    let user = null;
    for (let song of songList) {
      user = await userData.getUserById(song.author);
      song.artistName = user.firstName + " " + user.lastName;
    }

    if (req.session.user == undefined) {
      res.render("songs/index", {
        songs: songList,
        logged_in: false,
        // users: await songsData.getUsersBySongs(songList)
      });
    } else {
      res.render("songs/index", {
        songs: songList,
        logged_in: true,
        // users: await songData.getUsersBySongs(songList)
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  let songInfo = req.body;
  let file = req.file; //file

  if (!file) {
    res.status(400).json({ error: "you must provide song file" });
  }

  if (!songInfo) {
    res.status(400).json({ error: "You must provide data for the song" });
    return;
  }

  if (!songInfo.title || typeof songInfo.title != "string") {
    res
      .status(400)
      .json({ error: "You must provide a title of the song as string" });
    return;
  }

  if (!file.id || !(typeof file.id == "string" || ObjectId.isValid(file.id))) {
    res.status(400).json({
      error: "You must provide id of the file as a string or an object id",
    });
    return;
  }

  let genreList = [];

  if (!Array.isArray(songInfo.genre)) {
    genreList.push(xss(songInfo.genre));
  } else {
    genreList = xss(songInfo.genre);
  }

  try {
    const newSong = await songData.addSong(
      file.id,
      xss(songInfo.title),
      genreList,
      req.session.user._id
    );
    await userData.addSongToUser(req.session.user._id, String(newSong._id)); //changed
    res.redirect(`songs/${newSong._id}`);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/like/:id", async (req, res) => {
  console.log("reached like/id");
  let checkLikeDislike = await userData.checkLikeDislike(
    req.session.user._id,
    req.params.id
  );
  let user_liked = checkLikeDislike[0];
  let user_disliked = checkLikeDislike[1];

  if (user_liked) {
    let x = "no change";
  } else if (user_disliked) {
    await userData.removeDisLikedSong(req.session.user._id, req.params.id);
    await songData.decrementLikeDislike(req.params.id, "dislike");
    await userData.addLikedSong(req.session.user._id, req.params.id);
    let x = await songData.incrementLikeDislike(req.params.id, "like");
  } else {
    await userData.addLikedSong(req.session.user._id, req.params.id);
    let x = await songData.incrementLikeDislike(req.params.id, "like");
  }

  res.redirect(`/songs/${req.params.id}`);
});

router.get("/dislike/:id", async (req, res) => {
  console.log("reached dislike/id");
  let checkLikeDislike = await userData.checkLikeDislike(
    req.session.user._id,
    req.params.id
  );
  let user_liked = checkLikeDislike[0];
  let user_disliked = checkLikeDislike[1];

  if (user_disliked) {
    let x = "no change";
  } else if (user_liked) {
    await userData.removeLikedSong(req.session.user._id, req.params.id);
    await songData.decrementLikeDislike(req.params.id, "like");
    await userData.addDisLikedSong(req.session.user._id, req.params.id);
    let x = await songData.incrementLikeDislike(req.params.id, "dislike");
  } else {
    await userData.addDisLikedSong(req.session.user._id, req.params.id);
    let x = await songData.incrementLikeDislike(req.params.id, "dislike");
  }

  res.redirect(`/songs/${req.params.id}`);
});

router.patch("/:id", async (req, res) => {
  let updatedData = req.body;
  try {
    let x = await songData.getSongById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Song not found" });
    return;
  }

  try {
    updatedData.title = xss(updatedData.title);
    updatedData.genre = xss(updatedData.genre);

    const updatedSong = await songData.updateSong(req.params.id, updatedData);
    res.json(updatedSong);
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    deleted_record = await songData.getSongById(req.params.id);
    output_record = {};
    output_record.deleted = true;
    output_record.data = deleted_record;
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: "Song not found" });
    return;
  }

  try {
    await songData.removeSong(req.params.id);
    await userData.removeSongFromUser(deleted_record.author, req.params.id);
    res.json(output_record);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
