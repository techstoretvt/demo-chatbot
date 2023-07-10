"use strict";

var _express = _interopRequireDefault(require("express"));
var _ViewEngine = _interopRequireDefault(require("./config/ViewEngine"));
var _web = _interopRequireDefault(require("./routes/web"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
require('dotenv').config();
var app = (0, _express["default"])();

//config view engine
(0, _ViewEngine["default"])(app);

//parse request to json
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));

//init web routes
(0, _web["default"])(app);
var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Chatbot is running on port: ', port);
});