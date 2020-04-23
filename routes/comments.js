const express = require("express");
const router = express.Router();

const data = require("../data");
const commentData = data.comments;
const userData = data.users;
const songData = data.songs;

router.get("/new", async (req,res) => {
  try {
    const userList = await userData.getAllUsers();
    const songList = await songData.getAllSongs();
    res.render('comments/new',{
      users:userList,
      songs:songList
    });
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

// Post new comment
router.post("/", async (req, res) => {
  const newCommentData = req.body;
  try {
    if (!newCommentData.songId)
      throw new Error("Commment post request requires 'songId' parameter");
    if (!newCommentData.userId)
      throw new Error("Commment post request requires 'userId' parameter");
    if (!newCommentData.content)
      throw new Error("Commment post request requires 'content' parameter");

    if (typeof newCommentData.songId !== "string")
      throw new TypeError(
        "Expected string type for 'songId' parameter, got " +
          typeof newCommentData.songId
      );
    if (typeof newCommentData.userId !== "string")
      throw new TypeError(
        "Expected string type for 'userId' parameter, got " +
          typeof newCommentData.userId
      );
    if (typeof newCommentData.content !== "string")
      throw new TypeError(
        "Expected string type for 'content' parameter, got " +
          typeof newCommentData.content
      );

    if (newCommentData.content.length > 500)
      throw new Error(
        "Comment string must be at max 500 characters, got length " +
          newCommentData.content.length
      );
  } catch (e) {
    res.status(400).json({ error: e.toString() });
    return;
  }

  try {
    const { songId, userId, content } = newCommentData;
    const newComment = await commentData.addComment(songId, userId, content);
    res.json(newComment);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Get all comments
router.get("/", async (req, res) => {
  try {
    const commentList = await commentData.getAllComments();
    res.json(commentList);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Get comment by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) throw new Error("Commment get request requires 'id' parameter");

    if (typeof id !== "string")
      throw new TypeError(
        "Expected string type for 'id' parameter, got " + typeof id
      );
  } catch (e) {
    res.status(400).json({ error: e.toString() });
    return;
  }

  try {
    const comment = await commentData.getCommentById(id);
    res.render('comments/single',{comment:comment});
    //res.json(comment);
  } catch (e) {
    res.status(404).json({ message: "Comment with id '" + id + "' not found" });
  }
});

// Delete comment by id
router.delete("/:id", async (req, res) => {
  res.status(500).json({ error: "Not implemented" });
});

module.exports = router;
