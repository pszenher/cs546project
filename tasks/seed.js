const fs = require("fs");
const dbConnection = require("../config/mongoConnection");
const ObjectId = require("mongodb").ObjectId;
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const MockExpressRequest = require("mock-express-request");
const FormData = require("form-data");

const data = require("../data/");
const users = data.users;
const songs = data.songs;
const comments = data.comments;

async function uploadFileGridFS(multerHandle, filename) {
  if (typeof multerHandle !== "object")
    throw new TypeError(
      "Expected object type for multerHandle, got: " + typeof multerHandle
    );
  if (typeof filename !== "string")
    throw new TypeError(
      "Expecetd string type for filename, got: " + typeof filename
    );

  const form = new FormData();
  form.append(filename, fs.createReadStream(filename));

  const request = new MockExpressRequest({
    method: "POST",
    host: "localhost",
    url: "",
    headers: form.getHeaders(),
  });

  await form.pipe(request);
  return new Promise((resolve, reject) => {
    multerHandle.single(filename)(request, {}, () => {
      resolve(request.file);
    });
  });
}

async function main() {
  console.log("Awaiting connection to database...");
  const db = await dbConnection();
  console.log("Connected to database");

  console.log("Dropping current database...");
  await db.dropDatabase();

  console.log("Configuring GridFS connection...");
  const storage = new GridFsStorage({ db: db });
  const upload = multer({ storage });

  console.log("Seeding new database...");
  const testUser1 = await users.addUser(
    "Ashish",
    "Negi",
    "tmctest@email.com",
    "Male",
    "New York City",
    "NY",
    23,
    "password",
    "Hello I am Test McTest",
    ["rock"]
  );

  const testUser2 = await users.addUser(
    "Megahna",
    "Manikal",
    "agrande@mail.com",
    "Female",
    "Hoboken",
    "NJ",
    26,
    "password",
    "Hello I am Ariana Grande",
    ["pop"]
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

  const testUser4 = await users.addUser(
    "Paul",
    "Szenher",
    "pszenher@stevens.edu",
    "Male",
    "New York",
    "NY",
    21,
    "password",
    "Hello I am Paul Szenher",
    ["rock"]
  );

  const testUser1Song1Data = await uploadFileGridFS(
    upload,
    "./tasks/seed_data/Good_God.mp3"
  );
  const testUser1Song1 = await songs.addSong(
    testUser1Song1Data.id,
    "Good God",
    ["pop"],
    testUser1._id
  );
  await users.addSongToUser(testUser1._id, testUser1Song1._id);

  const testUser1Song2Data = await uploadFileGridFS(
    upload,
    "./tasks/seed_data/Hangtime.mp3"
  );
  const testUser1Song2 = await songs.addSong(
    testUser1Song2Data.id,
    "Hangtime",
    ["indie", "rock"],
    testUser1._id
  );
  await users.addSongToUser(testUser1._id, testUser1Song2._id);

  const testUser2Song1Data = await uploadFileGridFS(
    upload,
    "./tasks/seed_data/Hustle_Muscle.mp3"
  );
  const testUser2Song1 = await songs.addSong(
    testUser2Song1Data.id,
    "Hustle Muscle",
    ["rock"],
    testUser2._id
  );
  await users.addSongToUser(testUser2._id, testUser2Song1._id);

  const testUser2Song2Data = await uploadFileGridFS(
    upload,
    "./tasks/seed_data/Sad_Circus.mp3"
  );
  const testUser2Song2 = await songs.addSong(
    testUser2Song2Data.id,
    "Sad Circus",
    ["R&B"],
    testUser2._id
  );
  await users.addSongToUser(testUser2._id, testUser2Song2._id);

  const testUser2Song3Data = await uploadFileGridFS(
    upload,
    "./tasks/seed_data/They_Say.mp3"
  );
  const testUser2Song3 = await songs.addSong(
    testUser2Song3Data.id,
    "They Say",
    ["indie"],
    testUser2._id
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

  const testUser4Comment1 = await comments.addComment(
    testUser2Song1._id,
    testUser4._id,
    "This song is very intersting"
  );
  await songs.addRemoveCommentFromSong(
    testUser2Song1._id,
    testUser4Comment1._id,
    "add"
  );

  console.log("Database seeded successfully");
  await db.serverConfig.close();
}

main();
