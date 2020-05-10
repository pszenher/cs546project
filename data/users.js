const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const users = mongoCollections.users;

const bcrypt = require("bcrypt"); //Importing the NPM bcrypt package.
const salt = 10; //We are setting salt rounds, higher is safer.
// const myPlaintextPassword = 's0/\/\P4$$w0rD';

module.exports = {
  // This is a fun new syntax that was brought forth in ES6, where we can define
  // methods on an object with this shorthand!
  async getUserById(id) {
    if (!id) throw `id not found`;
    if (typeof id !== "string" && typeof id != "object") throw `Id Invalid`;
    if (typeof id == "string") {
      id = ObjectId.createFromHexString(id);
    }
    const userCollection = await users();

    let user = await userCollection.findOne({ _id: id });
    if (user === null) throw `No User with that id`;
    return user;
  },
  async getUserByEmail(email) {
    if (!email) throw `Provide email id`;
    if (typeof email !== "string") throw `Id Invalid`;

    const userCollection = await users();
    let user = await userCollection.findOne({ email: email });

    return user;
  },

  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
  },

  async addUser(
    firstName,
    lastName,
    email,
    gender,
    city,
    state,
    age,
    password,
    bio,
    interested
  ) {
    if (!firstName) throw `You must provide first name`;
    if (!lastName) throw `You must provide last name`;
    if (!email) throw `You must provide email`;
    if (!gender) throw `You must provide gender`;
    if (!city) throw `You must provide City`;
    if (!state) throw `You must provide state`;
    if (!age) throw `You must provide Age`;
    if (!password) throw `You must provide valid password`;
    if (!bio) throw `You must Provide Bio about Yourslef`;
    if (interested) {
      if (!Array.isArray(interested)) throw `interested must be an array`;
    }
    if (firstName) {
      if (typeof firstName != "string") throw `400 - Name is not a string`;
    }
    if (lastName) {
      if (typeof lastName != "string")
        throw { errocode: 400, field: "lastName" };
    }
    if (email) {
      if (typeof email != "string") throw { errocode: 400, field: "email" };
    }

    if (gender) {
      if (typeof gender != "string") throw { errocode: 400, field: "gender" };
    }
    if (city) {
      if (typeof city != "string") throw { errocode: 400, field: "city" };
    }
    if (state) {
      if (typeof state != "string") throw { errocode: 400, field: "state" };
    }
    if (age) {
      if (typeof age == "string") age = Number(age);
      if (age < 0)
        throw { errocode: 400, field: "Age cannot be negative number" };
    }
    if (password) {
      if (typeof password != "string")
        throw { errocode: 400, field: "password" };
    }
    password = await bcrypt.hash(password, salt);

    if (bio) {
      if (typeof bio != "string") throw { errocode: 400, field: "bio" };
    }

    const userCollection = await users();

    let newUSer = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      gender: gender,
      city: city,
      state: state,
      age: age,
      password: password,
      bio: bio,
      interested: interested,
    };

    const existingUser = await this.getUserByEmail(email.toLowerCase());
    if (existingUser != null) {
      throw `User with this Email already Exists`;
    }
    const insertInfo = await userCollection.insertOne(newUSer);
    if (insertInfo.insertedCount === 0) throw `Could not add User`;

    const newId = insertInfo.insertedId;

    const user = await this.getUserById(newId);
    return user;
  },

  async updateUser(
    id,
    firstName,
    lastName,
    email,
    gender,
    city,
    state,
    age,
    bio,
    interested
  ) {
    if (!id) throw `id not found`;
    if (typeof id !== "string" && typeof id != "object") throw `Id Invalid`;
    if (typeof id == "string") {
      id = ObjectId.createFromHexString(id);
    }
    let updateBody = {};

    if (firstName) {
      if (typeof firstName != "string") throw `400 - Name is not a string`;
      updateBody.firstName = firstName;
    }
    if (lastName) {
      if (typeof lastName != "string")
        throw { errocode: 400, field: "lastName" };
      updateBody.lastName = lastName;
    }
    if (email) {
      if (typeof email != "string") throw { errocode: 400, field: "email" };
      updateBody.email = email;
    }
    if (gender) {
      if (typeof gender != "string") throw { errocode: 400, field: "gender" };
      updateBody.gender = lastName;
    }
    if (city) {
      if (typeof city != "string") throw { errocode: 400, field: "city" };
      updateBody.city = city;
    }
    if (state) {
      if (typeof state != "string") throw { errocode: 400, field: "state" };
      updateBody.state = state;
    }

    if (age) {
      if (typeof age == "string") age = Number(age);
      if (age < 0)
        throw { errocode: 400, field: "Age cannot be negative number" };
      else updateBody.age = age;
    }

    if (bio) {
      if (typeof bio != "string") throw { errocode: 400, field: "bio" };
      updateBody.bio = bio;
    }
    if (Array.isArray(interested)) updateBody.interested = interested;

    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne(
      { _id: id },
      { $set: updateBody }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw `could not Update Liked  song successfully`;
    }

    return await this.getUserById(id);
  },

  async removeUser(id) {
    if (!id) throw `You must provide an id to search for`;
    if (typeof id !== "string" && typeof id != "object") throw `type invalid`;
    //Meghana
    //const objId = ObjectId.createFromHexString(id.toString());

    let objId = id;
    if (typeof objId == "string") {
      objId = ObjectId.createFromHexString(objId);
    }
    //Meghana
    const user = await this.getUserById(objId);
    const userCollection = await users();
    const deletionInfo = await userCollection.deleteOne({ _id: objId });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete User with id of ${objId}`;
    }

    return { deleted: true, data: user };
  },
  async updatePassword(id, password) {
    if (!id) throw `You must provide an id to search for`;
    if (typeof id !== "string" && typeof id != "object") throw `type invalid`;
    let objId = id;
    if (typeof objId == "string") {
      objId = ObjectId.createFromHexString(objId);
    }
    if (!password) throw `Please provide new password`;
    password = await bcrypt.hash(password, salt);
    const userCollection = await users();
    const updatePassword = {
      password: password,
    };
    const updatedInfo = await userCollection.updateOne(
      { _id: objId },
      { $set: updatePassword }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw `could not update Password successfully`;
    }
    return await this.getUserById(objId);
  },
  async addSongToPlaylist(id, songId) {
    const { user, objId } = await this.check_valid(id, songId);
    if (user.playlist != undefined && user.playlist.includes(songId))
      throw `Song is already present in the Playlist`;
    const updatePlaylist = {
      playlist: songId,
    };
    return await this.add_song(objId, updatePlaylist);
  },
  async removeSongFromPlaylist(id, songId) {
    const { user, objId } = await this.check_valid(id, songId);

    if (!user.playlist.includes(songId))
      throw `Song is not present in the Playlist`;

    const updatePlaylist = {
      playlist: songId,
    };
    return await this.remove_song(objId, updatePlaylist);
  },
  async addLikedSong(id, songId) {
    const { user, objId } = await this.check_valid(id, songId);
    if (user.liked_songs != undefined && user.liked_songs.includes(songId))
      throw `Song is already present in the Liked_songs`;
    const updateLikedSong = {
      liked_songs: songId,
    };
    return await this.add_song(objId, updateLikedSong);
  },
  async removeLikedSong(id, songId) {
    const { user, objId } = await this.check_valid(id, songId);

    if (!user.liked_songs.includes(songId))
      throw `Song is not present in the Liked_songs`;

    const updateLikedSong = {
      liked_songs: songId,
    };
    return await this.remove_song(objId, updateLikedSong);
  },
  async addDisLikedSong(id, songId) {
    const { user, objId } = await this.check_valid(id, songId);
    if (
      user.disliked_songs != undefined &&
      user.disliked_songs.includes(songId)
    )
      throw `Song is already present in the Disliked song`;
    const updateDisLikedSong = {
      disliked_songs: songId,
    };
    return await this.add_song(objId, updateDisLikedSong);
  },
  async removeDisLikedSong(id, songId) {
    const { user, objId } = await this.check_valid(id, songId);

    if (!user.disliked_songs.includes(songId))
      throw `Song is not present in the DisLiked_songs`;

    const updateDisLikedSong = {
      disliked_songs: songId,
    };
    return await this.remove_song(objId, updateDisLikedSong);
  },
  async addSongToUser(id, songId) {
    const { user, objId } = await this.check_valid(id, songId);
    if (user.songs != undefined && user.songs.includes(songId))
      throw `Song is already present in the songs`;
    const updateSongs = {
      songs: songId,
    };
    return await this.add_song(objId, updateSongs);
  },
  async removeSongFromUser(id, songId) {
    const { user, objId } = await this.check_valid(id, songId);
    if (!user.songs.includes(songId)) throw `Song is not present in the Songs`;
    const updateSongs = {
      songs: songId,
    };
    return await this.remove_song(objId, updateSongs);
  },

  async check_valid(id, songId) {
    if (!id) throw `You must provide an id to search for`;
    if (!songId) throw `You must provide a songId for the song to be added`;
    //TO-DO
    // Verify if the song is present in teh songs collection
    if (typeof id !== "string" && typeof id != "object") throw `type invalid`;
    let objId = id;
    if (typeof objId == "string") {
      objId = ObjectId.createFromHexString(objId);
    }
    const user = await this.getUserById(objId);
    return { user, objId };
  },

  async remove_song(objId, updateSong) {
    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne(
      { _id: objId },
      { $pull: updateSong }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw `could not remove Liked  song successfully`;
    }
    // decrement the liked_count of the song in songs collection
    return await this.getUserById(objId);
  },
  async add_song(objId, updateSong) {
    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne(
      { _id: objId },
      { $push: updateSong }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw `could not add Liked song successfully`;
    }
    return await this.getUserById(objId);
  },
  async checkLikeDislike(userId, songId) {
    const userCollection = await users();
    let user_liked = await userCollection.findOne({
      $and: [
        { _id: ObjectId.createFromHexString(userId) },
        { liked_songs: songId },
      ],
    });

    let user_disliked = await userCollection.findOne({
      $and: [
        { _id: ObjectId.createFromHexString(userId) },
        { disliked_songs: songId },
      ],
    });

    return [user_liked, user_disliked];
  },
};
