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
