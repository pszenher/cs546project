const common = require("../common.js");

describe("Comments Routes", function () {
  describe("POST Request '/comments'", function () {
    it("should respond with a JSON object", async function () {
      await chai
        .request(app)
        .post("/comments/")
        .send({
          songid: ObjectId().toString(),
          userId: ObjectId().toString(),
          content: "This is a comment.",
        })
        .then(function (res) {
          expect(res).to.be.json;
        });
    });
    it("should accept ObjectIds or strings for ids", async function () {
      await chai
        .request(app)
        .post("/comments/")
        .send({
          songid: ObjectId().toString(),
          userId: ObjectId(),
          content: "This is a comment.",
        })
        .then(function (res) {
          expect(res).to.be.json;
        });
    });
  });
  describe("GET Request '/comments/", function () {
    it("should respond with a JSON object", async function () {
      await chai
        .request(app)
        .get("/comments/")
        .then(function (res) {
          expect(res).to.be.json;
        });
    });
  });
  describe("GET Request '/comments/:id'", function () {
    it("should respond with a JSON object", async function () {
      await chai
        .request(app)
        .get("/comments/5ea1b230428f6c57e15ea971")
        .then(function (res) {
          expect(res).to.be.json;
        });
    });
  });
  describe("DELETE Request '/comments/:id'", function () {
    it("should respond with a JSON object", async function () {
      await chai
        .request(app)
        .delete("/comments/5ea1b230428f6c57e15ea971")
        .then(function (res) {
          expect(res).to.be.json;
        });
    });
  });
});
