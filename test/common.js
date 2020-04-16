const chai = require("chai");
// Set global testing flag to true
global.isTesting = true;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


global.assert = chai.assert;
global.expect = chai.expect;

global.data = require("../data");
global.routes = require("../routes");

global.mongoConnection = require("../config/mongoConnection");
global.ObjectId = require("mongodb").ObjectId;
