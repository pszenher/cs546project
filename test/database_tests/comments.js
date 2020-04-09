const common = require("../common.js");

after(async () => {
  const db = await mongoConnection();
  await db.serverConfig.close();
});

describe("Comments DB Collection", function () {
  describe("addComment()", function () {
    it("should return the added comment object when passed ObjectId types", async function () {
      newComment = await data.comments.addComment(
        ObjectId(),
        ObjectId(),
        "This is a comment"
      );
      expect(newComment).to.have.keys("_id", "songId", "userId", "content");
    });
    it("should have return comment with passed songId", async function () {
      const songId = ObjectId();
      newComment = await data.comments.addComment(
        songId,
        ObjectId(),
        "This is a comment"
      );
      expect(newComment.songId.toString()).to.equal(songId.toString());
    });
    it("should have return comment with passed userId", async function () {
      const userId = ObjectId();
      newComment = await data.comments.addComment(
        ObjectId(),
        userId,
        "This is a comment"
      );
      expect(newComment.userId.toString()).to.equal(userId.toString());
    });
    it("should have return comment with passed content", async function () {
      const test_comment = "Test comment body";
      newComment = await data.comments.addComment(
        ObjectId(),
        ObjectId(),
        test_comment
      );
      expect(newComment.content).to.equal(test_comment);
    });
    it("should reject promise with TypeError on invalid song parameter", async function () {
      await expect(
        data.comments.addComment(NaN, ObjectId(), "This is a comment.")
      ).to.be.rejectedWith(TypeError);
    });
    it("should reject promise with TypeError on invalid user parameter", async function () {
      await expect(
        data.comments.addComment(ObjectId(), NaN, "This is a comment.")
      ).to.be.rejectedWith(TypeError);
    });
    it("should reject promise with TypeError on invalid content parameter", async function () {
      await expect(
        data.comments.addComment(ObjectId(), ObjectId(), NaN)
      ).to.be.rejectedWith(TypeError);
    });
  });

  describe("getCommentById()", function () {
    it("should return comment object equal to one in database", async function () {
      new_comment = await data.comments.addComment(
        ObjectId(),
        ObjectId(),
        "comment"
      );
      get_comment = await data.comments.getCommentById(new_comment._id);
      expect(get_comment).to.deep.equal(new_comment);
    });
    it("should reject promise with Error if commentId is not in collection", async function () {
      await expect(data.comments.getCommentById(ObjectId())).to.be.rejectedWith(
        Error
      );
    });
    it("should reject promise with TypeError on invalid commentId parameter", async function () {
      await expect(data.comments.getCommentById(NaN)).to.be.rejectedWith(
        TypeError
      );
    });
  });
  describe("removeComment()", function () {});
});
