const dbConnection = require("../config/mongoConnection");
const ObjectId = require("mongodb").ObjectId;

const data = require("../data/");
const users = data.users;
const songs = data.songs;
const comments = data.comments;

async function main() {
  console.log("Awaiting connection to database...");
  const db = await dbConnection();
  console.log("Connected to database");

  console.log("Dropping current database...");
  await db.dropDatabase();

  console.log("Seeding new database...");
  const testUser1 = await users.addUser(
    "Test",
    "McTest",
    "tmctest@email.com",
    "Male",
    "New York City",
    "NY",
    20,
    "password",
    "Hello I am Test McTest",
    ["Rock"]
  );

  const testUser2 = await users.addUser(
    "Ariana",
    "Grande",
    "agrande@mail.com",
    "Female",
    "Hoboken",
    "NJ",
    26,
    "password",
    "Hello I am Ariana Grande",
    ["Pop"]
  );

  const testUser3 = await users.addUser(
    "Kirsten",
    "Meidlinger",
    "kirstenalice426@gmail.com",
    "Female",
    "Kendall Park",
    "NJ",
    20,
    "password",
    "Hello I am Kirsten Meidlinger",
    ["Alternative"]
  );

  const testUser1Song1 = await songs.addSong(
    ObjectId(),
    "Test Jam #1",
    ["Rock"],
    testUser1._id
  );
  await users.addSongToUser(testUser1._id, testUser1Song1._id);

  const testUser1Song2 = await songs.addSong(
    ObjectId(),
    "Test Jam #2",
    ["Pop", "Rock"],
    testUser1._id
  );
  await users.addSongToUser(testUser1._id, testUser1Song2._id);

  const testUser2Song1 = await songs.addSong(
    ObjectId(),
    "no tears left to cry",
    ["Pop", "R&B"],
    testUser1._id
  );
  await users.addSongToUser(testUser2._id, testUser2Song1._id);

  const testUser2Song2 = await songs.addSong(
    ObjectId(),
    "Good as Hell",
    ["Pop"],
    testUser1._id
  );
  await users.addSongToUser(testUser2._id, testUser2Song2._id);

  const testUser2Song3 = await songs.addSong(
    ObjectId(),
    "7 rings",
    ["Pop"],
    testUser1._id
  );
  await users.addSongToUser(testUser2._id, testUser2Song3._id);

  const testUser1Comment1 = await comments.addComment(
    testUser2Song1._id,
    testUser1._id,
    "I really like this song"
  );
  await songs.addRemoveCommentFromSong(
    testUser2Song1._id,
    testUser1Comment1._id,
    "add"
  );

  const testUser3Comment1 = await comments.addComment(
    testUser2Song1._id,
    testUser3._id,
    "I am also a fan of this song"
  );
  await songs.addRemoveCommentFromSong(
    testUser2Song1._id,
    testUser3Comment1._id,
    "add"
  );

  console.log("Database seeded successfully");
  await db.serverConfig.close();
}

main();
