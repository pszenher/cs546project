const express = require("express");
const router = express.Router();
const xss = require("xss");

const data = require("../data");
const commentData = data.comments;
const userData = data.users;
const songData = data.songs;

// :id in this case will be id of SONG being commented on not id of comment
router.get("/new/:id", async (req, res) => {
  try {
    if (req.session && req.session.user) {
      res.render("comments/new", {
        user: await userData.getUserById(req.session.user._id),
        song: await songData.getSongById(req.params.id),
        logged_in: true,
      });
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Post new comment
router.post("/", async (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect("login");
  }

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
    let { songId, userId, content } = newCommentData;
    songId = xss(songId);
    userId = xss(userId);
    content = xss(content);
    const newComment = await commentData.addComment(songId, userId, content);

    await songData.addRemoveCommentFromSong(songId, newComment._id, "add");
    res.redirect("songs/" + newComment.songId);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Get all comments
router.get("/", async (req, res) => {
  try {
    let commentList = await commentData.getAllComments();
    let user = null;
    for(let x=0;x<commentList.length;x++){
      user = await userData.getUserById(commentList[x].userId);
      commentList[x].userName = user.firstName + " " + user.lastName;
    }

    res.render("comments/index", {
      comments: commentList,
      logged_in: req.session && req.session.user ? true : false,
      user: await userData.getUserById(req.session.user._id)
    });
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
    let comment = await commentData.getCommentById(id);
    let user = await userData.getUserById(comment.userId);
    comment.userName = user.firstName + " " + user.lastName;

    res.render("comments/single", {
      comment: comment,
      logged_in: req.session && req.session.user ? true : false
    });
  } catch (e) {
    res.status(404).json({ message: "Comment with id '" + id + "' not found" });
  }
});

// Delete comment by id
router.delete("/:id", async (req, res) => {
  res.status(500).json({ error: "Not implemented" });
});

module.exports = router;
