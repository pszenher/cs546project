const chai = require("chai");

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
