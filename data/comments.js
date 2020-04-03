const ObjectId = require("mongodb").ObjectId;
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;

async function addComment(songId, userId, content) {
  if (typeof songId !== "object" && typeof songId !== "string")
    throw new TypeError(
      "Expeced string or object type for songId, got " + typeof songId
    );
  if (typeof userId !== "object" && typeof userId !== "string")
    throw new TypeError(
      "Expeced string or object type for userId, got " + typeof userId
    );
  if (typeof content !== "string")
    throw new TypeError(
      "Expeced string type for comment content, got " + typeof content
    );

  if (!ObjectId.isValid(songId))
    throw new TypeError(
      "Expeced valid mongodb Object for songId, got " + songId
    );
  if (!ObjectId.isValid(userId))
    throw new TypeError(
      "Expeced valid mongodb Object for userId, got " + userId
    );

  const commentCollection = await comments();

  let newComment = {
    songId: songId,
    userId: userId,
    content: content,
  };

  const insertInfo = await commentCollection.insertOne(newComment);
  if (insertInfo.insertCount === 0)
    throw new Error("Adding to comment to comment collection failed");

  const insertedComment = await getCommentById(insertInfo.insertedId);
  return insertedComment;
}

async function getCommentById(commentId) {
  if (typeof commentId !== "string" && typeof commentId !== "object")
    throw new TypeError(
      "Expeced string or object type for commentId, got " + typeof commentId
    );
  if (!ObjectId.isValid(commentId))
    throw new TypeError(
      "Expeced valid mongodb Object for commentId, got " + commentId
    );

  const commentCollection = await comments();
  const thisComment = await commentCollection.findOne({ _id: commentId });
  if (thisComment === null)
    throw new Error("Failed to get comment with id " + commentId);

  return thisComment;
}

async function removeComment(commentId) {
  if (typeof commentId !== "string" && typeof commentId !== "object")
    throw new TypeError(
      "Expeced string or object type for commentId, got " + typeof commentId
    );
  if (!ObjectId.isValid(commentId))
    throw new TypeError(
      "Expeced valid mongodb Object for commentId, got " + commentId
    );

  const commentCollection = await comments();
  const deletedComment = await commentCollection.findOne({ _id: commentId });
  if (deletionInfo.deletedCount === 0)
    throw new Error("Failed to delete comment with id " + commentId);

  const deletionInfo = await commentCollection.deleteOne({ _id: commentId });
  if (deletionInfo.deletedCount === 0)
    throw new Error("Failed to delete comment with id " + commentId);

  return deletedComment;
}

module.exports = { addComment, getCommentById, removeComment };
