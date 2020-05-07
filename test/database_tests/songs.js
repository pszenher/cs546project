const common = require("../common.js");

after(async () => {
  const db = await mongoConnection();
  await db.music_db.serverConfig.close();
});

afterEach(async () => {
  const db = await mongoConnection();
  await db.music_db.dropDatabase();
});

describe("Songs DB Collection", function () {
  describe("addSong()", function () {
    it("should return the added song object when passed details", async function () {
      newSong = await data.songs.addSong(
        "5e8e232b9465fc443cbedf93",
        "My album 3",
        ["rock", "pop"],
        "5e8e232b9465fc443cbedf8c"
      );
      expect(newSong).to.have.keys(
        "_id",
        "title",
        "author",
        "file",
        "genre",
        "like_cnt",
        "dislike_cnt",
        "comment_id"
      );
    });
    it("should have return song with passed author or user id", async function () {
      newSong = await data.songs.addSong(
        "5e8e232b9465fc443cbedf93",
        "My album 3",
        ["rock", "pop"],
        "5e8e232b9465fc443cbedf8c"
      );
      expect(newSong.author.toString()).to.equal("5e8e232b9465fc443cbedf8c");
    });
    it("should have return comment with passed file id", async function () {
      newSong = await data.songs.addSong(
        "5e8e232b9465fc443cbedf93",
        "My album 3",
        ["rock", "pop"],
        "5e8e232b9465fc443cbedf8c"
      );
      expect(newSong.file.toString()).to.equal("5e8e232b9465fc443cbedf93");
    });
    it("should have return comment with passed title", async function () {
      newSong = await data.songs.addSong(
        "5e8e232b9465fc443cbedf93",
        "My album 3",
        ["rock", "pop"],
        "5e8e232b9465fc443cbedf8c"
      );
      expect(newSong.title.toString()).to.equal("My album 3");
    });
    it("should have return comment with passed array of genre", async function () {
      newSong = await data.songs.addSong(
        "5e8e232b9465fc443cbedf93",
        "My album 3",
        ["rock", "pop"],
        "5e8e232b9465fc443cbedf8c"
      );
      expect(newSong.genre.toString()).to.equal(["rock", "pop"].toString());
    });
  });
});
