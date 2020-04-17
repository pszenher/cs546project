const common = require("../common.js");

after(async () => {
  const db = await mongoConnection();
  await db.serverConfig.close();
});

describe("Users DB Collection", function () {
  describe("addUser()", function () {
    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      expect(newUser).to.have.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        "age",
        "password",
        "bio",
        "interested"
      );
      expect(newUser.firstName.toString()).to.equal("firstName");
    });
    it("should reject promise with error on invalid user attribute", async function () {
      await expect(
        data.users.addUser(
          NaN,
          "lastName",
          "email",
          "gender",
          "city",
          "state",
          25,
          "password",
          "bio",
          ["interested1", "interestes2"]
        )
      ).to.be.rejectedWith("You must provide first name");
    });
  });

  describe("getUserById()", function () {
    it("should return the added user object when passed a valid id", async function () {
      new_user = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      const get_user = await data.users.getUserById(new_user._id);
      expect(get_user).to.deep.equal(new_user);
    });
    it("should reject promise with Error if userId is not in collection", async function () {
      await expect(data.users.getUserById(ObjectId())).to.be.rejectedWith(
        "No User with that id"
      );
    });
    it("should reject promise with Error if userId is not in collection", async function () {
      await expect(data.users.getUserById(NaN)).to.be.rejectedWith(
        "id not found"
      );
    });
  });

  describe("updateUser()", function () {
    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      updateUser = await data.users.updateUser(
        newUser._id,
        "NewName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio"
      );
      expect(updateUser).to.have.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        "age",
        "password",
        "bio",
        "interested"
      );
      expect(updateUser.firstName.toString()).to.equal("NewName");
    });

    it("should reject promise with error on invalid user attribute", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      await expect(
        data.users.updateUser(
          newUser._id,
          25,
          "lastName",
          "email",
          "gender",
          "city",
          "state",
          25,
          "password",
          "bio"
        )
      ).to.be.rejectedWith("400 - Name is not a string");
    });

    it("should reject promise with error on invalid Id", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      await expect(
        data.users.updateUser(
          NaN,
          "NewName",
          "lastName",
          "email",
          "gender",
          "city",
          "state",
          25,
          "password",
          "bio"
        )
      ).to.be.rejectedWith("id not found");
    });
  });

  describe("removeUser()", function () {
    it("should return user object equal to one in database", async function () {
      new_user = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      const remove_user = await data.users.removeUser(new_user._id);
      expect(remove_user.deleted).to.equal(true);
    });

    it("should reject promise with error on invalid id", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      await expect(data.users.removeUser(NaN)).to.be.rejectedWith(
        "You must provide an id to search for"
      );
    });
  });

  describe("updatePassword()", function () {
    it("should return the user object with updated password", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      updatePassword = await data.users.updatePassword(newUser._id, "NewPass");
      expect(updatePassword).to.have.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        "age",
        "password",
        "bio",
        "interested"
      );
      expect(updatePassword.password.toString()).to.equal("NewPass");
    });

    it("should reject promise with error on invalid user attribute", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      await expect(
        data.users.updatePassword(newUser._id, NaN)
      ).to.be.rejectedWith("Please provide new password");
    });

    it("should reject promise with error on invalid user attribute", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      await expect(
        data.users.updatePassword(NaN, "NewPass")
      ).to.be.rejectedWith("You must provide an id to search for");
    });
  });

  describe("addSongToPlaylist()", function () {
    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      newSongtoPlaylist = await data.users.addSongToPlaylist(
        newUser._id,
        "Song_Id"
      );
      expect(newSongtoPlaylist).to.have.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        "age",
        "password",
        "playlist",
        "bio",
        "interested"
      );
      expect(newSongtoPlaylist.playlist).to.includes("Song_Id");
      await expect(
        data.users.addSongToPlaylist(newUser._id, "Song_Id")
      ).to.be.rejectedWith("Song is already present in the Playlist");
    });

    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      await expect(
        data.users.addSongToPlaylist(NaN, "Song_Id")
      ).to.be.rejectedWith("You must provide an id to search for");
    });
  });

  describe("removeSongFromPlaylist()", function () {
    it("should return the  user object ", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      newSongtoPlaylist = await data.users.addSongToPlaylist(
        newUser._id,
        "Song_Id"
      );

      remove_song = await data.users.removeSongFromPlaylist(
        newSongtoPlaylist._id,
        "Song_Id"
      );
      expect(remove_song).to.have.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        "age",
        "password",
        "playlist",
        "bio",
        "interested"
      );

      expect(remove_song.playlist.includes("Song_Id")).to.be.equal(false);
      await expect(
        data.users.removeSongFromPlaylist(newUser._id, "Song_Id")
      ).to.be.rejectedWith("Song is not present in the Playlist");
    });

    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      await expect(
        data.users.removeSongFromPlaylist(NaN, "Song_Id")
      ).to.be.rejectedWith("You must provide an id to search for");
    });
  });

  describe("addLikedSong()", function () {
    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      newSongtoLiked = await data.users.addLikedSong(newUser._id, "Song_Id");
      expect(newSongtoLiked).to.have.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        "age",
        "password",
        "liked_songs",
        "bio",
        "interested"
      );
      expect(newSongtoLiked.liked_songs).to.includes("Song_Id");
      await expect(
        data.users.addLikedSong(newUser._id, "Song_Id")
      ).to.be.rejectedWith("Song is already present in the Liked_songs");
    });

    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      await expect(data.users.addLikedSong(NaN, "Song_Id")).to.be.rejectedWith(
        "You must provide an id to search for"
      );
    });
  });

  describe("removeLikedSong()", function () {
    it("should return the  user object ", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      newSongtoLiked = await data.users.addLikedSong(newUser._id, "Song_Id");

      remove_song = await data.users.removeLikedSong(
        newSongtoLiked._id,
        "Song_Id"
      );
      expect(remove_song).to.have.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        "age",
        "password",
        "liked_songs",
        "bio",
        "interested"
      );

      expect(remove_song.liked_songs.includes("Song_Id")).to.be.equal(false);
      await expect(
        data.users.removeLikedSong(newUser._id, "Song_Id")
      ).to.be.rejectedWith("Song is not present in the Liked_songs");
    });

    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      await expect(
        data.users.removeLikedSong(NaN, "Song_Id")
      ).to.be.rejectedWith("You must provide an id to search for");
    });

    describe("addDisLikedSong()", function () {
      it("should return the added user object when passed user attributes", async function () {
        newUser = await data.users.addUser(
          "firstName",
          "lastName",
          "email",
          "gender",
          "city",
          "state",
          25,
          "password",
          "bio",
          ["interested1", "interestes2"]
        );
        newSongtoDisLiked = await data.users.addDisLikedSong(
          newUser._id,
          "Song_Id"
        );
        expect(newSongtoDisLiked).to.have.keys(
          "_id",
          "firstName",
          "lastName",
          "email",
          "gender",
          "city",
          "state",
          "age",
          "password",
          "disliked_songs",
          "bio",
          "interested"
        );
        expect(newSongtoDisLiked.disliked_songs).to.includes("Song_Id");
        await expect(
          data.users.addDisLikedSong(newUser._id, "Song_Id")
        ).to.be.rejectedWith("Song is already present in the Disliked song");
      });

      it("should return the added user object when passed user attributes", async function () {
        newUser = await data.users.addUser(
          "firstName",
          "lastName",
          "email",
          "gender",
          "city",
          "state",
          25,
          "password",
          "bio",
          ["interested1", "interestes2"]
        );

        await expect(
          data.users.addDisLikedSong(NaN, "Song_Id")
        ).to.be.rejectedWith("You must provide an id to search for");
      });
    });
  });

  describe("removeDisLikedSong()", function () {
    it("should return the  user object ", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      newSongtoDisLiked = await data.users.addDisLikedSong(
        newUser._id,
        "Song_Id"
      );

      remove_song = await data.users.removeDisLikedSong(
        newSongtoDisLiked._id,
        "Song_Id"
      );
      expect(remove_song).to.have.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        "age",
        "password",
        "disliked_songs",
        "bio",
        "interested"
      );

      expect(remove_song.disliked_songs.includes("Song_Id")).to.be.equal(false);
      await expect(
        data.users.removeDisLikedSong(newUser._id, "Song_Id")
      ).to.be.rejectedWith("Song is not present in the DisLiked_songs");
    });

    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      await expect(
        data.users.removeDisLikedSong(NaN, "Song_Id")
      ).to.be.rejectedWith("You must provide an id to search for");
    });
  });

  describe("addSongToUser()", function () {
    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );
      newSong = await data.users.addSongToUser(newUser._id, "Song_Id");
      expect(newSong).to.have.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        "age",
        "password",
        "songs",
        "bio",
        "interested"
      );
      expect(newSong.songs).to.includes("Song_Id");
      await expect(
        data.users.addSongToUser(newUser._id, "Song_Id")
      ).to.be.rejectedWith("Song is already present in the songs");
    });

    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      await expect(data.users.addSongToUser(NaN, "Song_Id")).to.be.rejectedWith(
        "You must provide an id to search for"
      );
    });
  });

  describe("removeSongFromUser()", function () {
    it("should return the  user object ", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      newSong = await data.users.addSongToUser(newUser._id, "Song_Id");

      remove_song = await data.users.removeSongFromUser(newSong._id, "Song_Id");
      expect(remove_song).to.have.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        "age",
        "password",
        "songs",
        "bio",
        "interested"
      );

      expect(remove_song.songs.includes("Song_Id")).to.be.equal(false);
      await expect(
        data.users.removeSongFromUser(newUser._id, "Song_Id")
      ).to.be.rejectedWith("Song is not present in the Songs");
    });

    it("should return the added user object when passed user attributes", async function () {
      newUser = await data.users.addUser(
        "firstName",
        "lastName",
        "email",
        "gender",
        "city",
        "state",
        25,
        "password",
        "bio",
        ["interested1", "interestes2"]
      );

      await expect(
        data.users.removeSongFromUser(NaN, "Song_Id")
      ).to.be.rejectedWith("You must provide an id to search for");
    });
  });
});
