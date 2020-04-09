const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();
const data = require("../data");
const songData = data.songs;
const userData = data.users;
const { ObjectId } = require("mongodb");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/:id", async (req, res) => {
  try {
    const song = await songData.getSongById(req.params.id);
    res.status(200).json(song);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get("/", async (req, res) => {
  try {
    const songList = await songData.getAllSongs();
    res.status(200).json(songList);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  let songInfo = req.body;

  if (!songInfo) {
    res.status(400).json({ error: "You must provide data for the album" });
    return;
  }

  if (!songInfo.title || typeof songInfo.title != "string") {
    res
      .status(400)
      .json({ error: "You must provide a title of the album as string" });
    return;
  }

  if (
    !songInfo.user ||
    typeof songInfo.user != "string" ||
    !ObjectId.isValid(songInfo.user)
  ) {
    res
      .status(400)
      .json({
        error: "You must provide id of the artist as a string or an object id",
      });
    return;
  }

  if (
    !songInfo.file ||
    typeof songInfo.file != "string" ||
    !ObjectId.isValid(songInfo.file)
  ) {
    res
      .status(400)
      .json({
        error: "You must provide id of the file as a string or an object id",
      });
    return;
  }

  if (!songInfo.genre || !Array.isArray(songInfo.genre)) {
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
      songInfo.file,
      songInfo.title,
      songInfo.genre,
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
