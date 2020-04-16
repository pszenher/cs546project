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
  });
  describe("GET Request '/comments/:id'", function () {});
  describe("DELETE Request '/comments/:id'", function () {});
});
