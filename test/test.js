const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const data = require("../data");
const routes = require("../routes");

const ObjectId = require("mongodb").ObjectId;

// Close database after all tests have run
after(async () => {
  const connection = require("../config/mongoConnection");
  const db = await connection();
  await db.serverConfig.close();
});

// Basic unit test to display format, should always pass
describe("Sanity Check", function () {
  describe("triple equals (===)", function () {
    it("should return true when type and value are the same for both arguments", function () {
      assert(1 === 1);
    });
  });
});

// Database Method Unit Tests
describe("Database Methods", function () {
  describe("Comments", function () {
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
        songId = ObjectId();
        userId = ObjectId();
        newComment = await data.comments.addComment(
          songId,
          userId,
          "This is a comment"
        );
        expect(newComment.songId.toString()).to.equal(songId.toString());
      });
      it("should have return comment with passed userId", async function () {
        songId = ObjectId();
        userId = ObjectId();
        newComment = await data.comments.addComment(
          songId,
          userId,
          "This is a comment"
        );
        expect(newComment.userId.toString()).to.equal(userId.toString());
      });
    });
  });
});


describe("Database Methods", function () {
  describe("users", function () {
    describe("addSong()", function () {
      it("should return the added song object when passed details", async function () {
        newSong = await data.songs.addSong(
          "5e8e232b9465fc443cbedf93",
          "My album 3",
          ["rock", "pop"],
          "5e8e232b9465fc443cbedf8c"
        );
        expect(newSong).to.have.keys("_id", "title", "author", "file", "genre", "like_cnt", "dislike_cnt", "comment_id");
      });
      it("should have return song with passed author or user id", async function () {
        // songId = ObjectId();
        // userId = ObjectId();
        newSong = await data.songs.addSong(
          "5e8e232b9465fc443cbedf93",
          "My album 3",
          ["rock", "pop"],
          "5e8e232b9465fc443cbedf8c"
        );
        expect(newSong.author.toString()).to.equal("5e8e232b9465fc443cbedf8c");
      });
      it("should have return comment with passed file id", async function () {
        // songId = ObjectId();
        // userId = ObjectId();
        newSong = await data.songs.addSong(
          "5e8e232b9465fc443cbedf93",
          "My album 3",
          ["rock", "pop"],
          "5e8e232b9465fc443cbedf8c"
        );
        expect(newSong.file.toString()).to.equal("5e8e232b9465fc443cbedf93");
      });
    });
  });
});

