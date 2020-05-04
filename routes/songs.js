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

    let commentIds = song.comment_id;
    let comments = [];
    for (let x = 0; x < commentIds.length; x++) {
      comments[x] = await commentData.getCommentById(commentIds[x]);
    }

    res.render("songs/single", { song: song, comments: comments });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get("/", async (req, res) => {
  try {
    const songList = await songData.getAllSongs();
    res.render("songs/index", { songs: songList });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  console.log(req);
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

  if (
    !songInfo.user ||
    typeof songInfo.user != "string" ||
    !ObjectId.isValid(songInfo.user)
  ) {
    res.status(400).json({
      error: "You must provide id of the artist as a string or an object id",
    });
    return;
  }

  if (!file.id || !(typeof file.id == "string" || ObjectId.isValid(file.id))) {
    res.status(400).json({
      error: "You must provide id of the file as a string or an object id",
    });
    return;
  }

  // super shady prototype string to array function, needs to be fixed lol
  let genreList = await convertStringToGenreArray(songInfo.genre);

  if (!songInfo.genre || !Array.isArray(genreList)) {
    res
      .status(400)
      .json({ error: "You must provide a array of genre in the song" });
    return;
  }

  try {
    user = await userData.getUserById(songInfo.user);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  try {
    const newSong = await songData.addSong(
      file.id,
      songInfo.title,
      genreList,
      songInfo.user
    );
    await userData.addSongToUser(songInfo.user, String(newSong._id)); //changed
    res.status(200).json(newSong);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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
