const mongoCollections = require("../config/mongoCollections");
const users_coll = mongoCollections.users;
const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();
const data = require("../data");
const songData = data.songs;
const userData = data.users;
const commentData = data.comments;
const { ObjectId } = require("mongodb");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const url = "mongodb://localhost:27017/database";

// Create a storage object with a given configuration
const storage = new GridFsStorage({ url: url });

// Set multer storage engine to the newly created object
const upload = multer({ storage });

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/new", async (req, res) => {
  try {
    if (req.session && req.session.user) {
      let user = await userData.getUserById(req.session.user._id);
      res.render("songs/new", { user: user });
    } else {
      res.backURL = "songs/new";
      res.redirect("/login");
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const song = await songData.getSongById(req.params.id);
    // console.log(song)

    let commentIds = song.comment_id;
    let comments = [];
    for (let x = 0; x < commentIds.length; x++) {
      comments[x] = await commentData.getCommentById(commentIds[x]);
    }
    console.log(req.session.user == undefined);
    if (req.session.user == undefined) {
      res.render("songs/single", {
        song: song,
        comments: comments,
        user: false,
      });
    } else {
      res.render("songs/single", {
        song: song,
        comments: comments,
        user: true,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get("/", async (req, res) => {
  try {
    const songList = await songData.getAllSongs();
    // console.log(songList)
    console.log(req.session.user == undefined);
    if (req.session.user == undefined) {
      res.render("songs/index", { songs: songList, user: false });
    } else {
      res.render("songs/index", { songs: songList, user: true });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  console.log(req.file);
  let songInfo = req.body;
  let file = req.file; //file

  console.log(req.body);

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

  // if (
  //   !songInfo.user ||
  //   typeof songInfo.user != "string" ||
  //   !ObjectId.isValid(songInfo.user)
  // ) {
  //   res.status(400).json({
  //     error: "You must provide id of the artist as a string or an object id",
  //   });
  //   return;
  // }

  if (!file.id || !(typeof file.id == "string" || ObjectId.isValid(file.id))) {
    res.status(400).json({
      error: "You must provide id of the file as a string or an object id",
    });
    return;
  }

  let genreList = [];
  // super shady prototype string to array function, needs to be fixed lol
  if (!Array.isArray(songInfo.genre)) {
    genreList.push(songInfo.genre);
  } else {
    genreList = songInfo.genre;
  }

  if (!songInfo.genre || !Array.isArray(genreList)) {
    res
      .status(400)
      .json({ error: "You must provide a array of genre in the song" });
    return;
  }

  // try {
  //   user = await userData.getUserById(req.session.user._id);
  // } catch (e) {
  //   res.status(404).json({ error: "User not found" });
  //   return;
  // }
  console.log(req.session.user);
  try {
    const newSong = await songData.addSong(
      file.id,
      songInfo.title,
      genreList,
      req.session.user._id
    );
    await userData.addSongToUser(req.session.user._id, String(newSong._id)); //changed
    console.log(newSong);
    res.status(200).json(newSong);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/like/:id", async (req, res) => {
  console.log(req.session.user);
  console.log(req.params.id);
  console.log("hello");
  console.log(typeof req.session.user._id);
  console.log(typeof req.params.id);
  const userCollection = await users_coll();
  let user_liked = await userCollection.findOne({
    $and: [
      { _id: ObjectId.createFromHexString(req.session.user._id) },
      { liked_songs: req.params.id },
    ],
  });

  let user_disliked = await userCollection.findOne({
    $and: [
      { _id: ObjectId.createFromHexString(req.session.user._id) },
      { disliked_songs: req.params.id },
    ],
  });

  console.log(user_liked);
  console.log(user_disliked);

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

  res.redirect("/songs");
});

router.get("/dislike/:id", async (req, res) => {
  console.log(req.session.user);
  console.log(req.params.id);
  console.log("not hello");

  const userCollection = await users_coll();
  let user_liked = await userCollection.findOne({
    $and: [
      { _id: ObjectId.createFromHexString(req.session.user._id) },
      { liked_songs: req.params.id },
    ],
  });

  let user_disliked = await userCollection.findOne({
    $and: [
      { _id: ObjectId.createFromHexString(req.session.user._id) },
      { disliked_songs: req.params.id },
    ],
  });

  console.log(user_liked);
  console.log(user_disliked);

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

  res.redirect("/songs");
});

router.patch("/:id", async (req, res) => {
  const updatedData = req.body;
  try {
    let x = await songData.getSongById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Song not found" });
    return;
  }

  try {
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
