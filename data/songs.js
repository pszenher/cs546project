const mongoCollections = require("../config/mongoCollections");
const songs = mongoCollections.songs;
const files = mongoCollections.files;
const gridChunks = mongoCollections.chunks;
const { ObjectId } = require("mongodb");

const id_check = async function (id) {
  if (typeof id === "string") {
    const objId = ObjectId.createFromHexString(id);
    return objId;
  } else {
    return id;
  }
};

const exportedMethods = {
  async getAllSongs() {
    const songCollection = await songs();

    const songList = await songCollection.find({}).toArray();

    return songList;
  },

  async getSongById(id) {
    if (!id) throw "You must provide a id of the album";
    if (typeof id != "string" && typeof id != "object")
      throw "Input Album Id should be string or object";

    id = await id_check(id);

    const songCollection = await songs();
    const song = await songCollection.findOne({ _id: id });
    if (!song) throw "Song not found";

    return song;
  },
  async getSongMeta(id) {
    if (!id) throw "You must provide a id of the album";
    if (typeof id != "string" && typeof id != "object")
      throw "Input Album Id should be string or object";
    const filesCollection = await files();
    const songFile = await filesCollection.findOne({ _id: id });
    return songFile;
  },
  async getSongFile(id) {
    if (!id) throw "You must provide a id of the album";
    if (typeof id != "string" && typeof id != "object")
      throw "Input Album Id should be string or object";

    id = await id_check(id);
    const gridCollection = await gridChunks();
    const fileDataArr = await gridCollection
      .find({ files_id: id })
      .sort({ n: 1 });

    return fileDataArr
      .map((fileData) => {
        return fileData.data.toString("base64");
      })
      .toArray();
  },

  // gets all songs that contain the genres in genresList
  async getSongsByGenres(genresList) {
    if (!genresList) throw "You must provide a list of genres!";
    if (!Array.isArray(genresList))
      throw "You must provide an array of genres!";

    const songCollection = await songs();

    let songList = [];
    for (let x = 0; x < genresList.length; x++) {
      songList = songList.concat(
        await songCollection
          .find({ genre: { $all: [genresList[x]] } })
          .toArray()
      );
    }

    return songList;
  },

  async addSong(fileId, Title, genre, artistId) {
    if (!Title) throw "You must provide a Title for the album";
    if (!genre) throw "You must provide an array of genre for the song";
    if (!fileId) throw "You must provide a id of the music file";
    if (!artistId) throw "You must provide a id of the user";

    if (typeof Title !== "string")
      throw "Input of Title of album should be string";
    if (typeof fileId != "string" && typeof fileId != "object") {
      throw "Input file Id should be string or object";
    }
    if (typeof artistId != "string" && typeof artistId != "object") {
      throw "Input user Id should be string or object";
    }
    if (typeof genre != "object" && !Array.isArray(genre))
      throw "Please provide the list of genre in Array";

    fileId = await id_check(fileId);
    artistId = await id_check(artistId);

    const songCollection = await songs();

    const newSong = {
      title: Title,
      author: artistId,
      file: fileId,
      genre: genre,
      like_cnt: 0,
      dislike_cnt: 0,
      comment_id: [],
    };

    const newInsertInformation = await songCollection.insertOne(newSong);
    const newId = newInsertInformation.insertedId;

    return await this.getSongById(newId);
  },

  async removeSong(id) {
    if (!id) throw "You must provide a id of the song";

    if (typeof id != "string" && typeof id != "object")
      throw "Input song Id should be string or object";

    id = await id_check(id);

    const songCollection = await songs();
    let song = null;

    song = await this.getSongById(id);

    const deletionInfo = await songCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete song with id of ${id}`;
    }

    return song;
  },

  async updateSong(id, updatedSong) {
    if (!id) throw "You must provide an id of the song";

    id = await id_check(id);

    const songCollection = await songs();

    if (updatedSong.title) {
      if (typeof updatedSong.title != "string")
        throw "Please provide a song name as a string";
      await songCollection.updateOne(
        { _id: id },
        { $set: { title: updatedSong.title } }
      );
    }

    if (updatedSong.genre) {
      if (
        typeof updatedSong.genre != "object" &&
        !Array.isArray(updatedSong.genre)
      )
        throw "Please provide the list of genre in Array";
      await songCollection.updateOne(
        { _id: id },
        { $set: { genre: updatedSong.genre } }
      );
    }

    return await this.getSongById(id);
  },

  async incrementLikeDislike(songId, reaction) {
    if (!songId) throw "You must provide an id of the song";

    songId = await id_check(songId);

    const songCollection = await songs();

    if (reaction === "like") {
      await songCollection.updateOne({ _id: id }, { $inc: { like_cnt: 1 } });
    } else {
      await songCollection.updateOne({ _id: id }, { $inc: { dislike_cnt: 1 } });
    }

    return await this.getSongById(id);
  },

  async decrementLikeDislike(songId, reaction) {
    if (!songId) throw "You must provide an id of the song";

    songId = await id_check(songId);

    const songCollection = await songs();

    if (reaction === "like") {
      await songCollection.updateOne(
        { _id: songId },
        { $inc: { like_cnt: -1 } }
      );
    } else {
      await songCollection.updateOne(
        { _id: songId },
        { $inc: { dislike_cnt: -1 } }
      );
    }

    return await this.getSongById(id);
  },

  async addRemoveCommentFromSong(songId, commentId, operation) {
    if (!songId) throw "You must provide an id of the song";
    if (!commentId) throw "You must provide an id of the comment to remove";

    songId = await id_check(songId);
    commentId = await id_check(commentId);

    const songCollection = await songs();

    if (operation === "add") {
      await songCollection.updateOne(
        { _id: songId },
        { $addToSet: { comment_id: commentId } }
      );
    } else {
      await songCollection.updateOne(
        { _id: songId },
        { $pull: { comment_id: commentId } }
      );
    }

    return await this.getSongById(songId);
  },
};

module.exports = exportedMethods;
