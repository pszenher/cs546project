const MongoClient = require("mongodb").MongoClient;
const settings = require("./settings");

const mongoConfig = settings.mongoConfig;
const mongoGridConfig = settings.mongoGridConfig;

if (global.isTesting) mongoConfig.database = mongoConfig.testDatabase;

let _connection = undefined;
let _db = undefined;
let _gridconnection = undefined;
let _gridDb = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
