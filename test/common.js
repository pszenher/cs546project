// Configure local chai variables and plugins
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

// configure chai function gloabls
global.chai = chai;
global.assert = chai.assert;
global.expect = chai.expect;

// Configure project function globals
global.data = require("../data");
global.routes = require("../routes");

// Configure mongodb function globals
global.mongoConnection = require("../config/mongoConnection");
global.ObjectId = require("mongodb").ObjectId;

// Configure express and routes
const express = require("express");
const app = express();
app.use(express.json());
routes(app);
global.app = app;
