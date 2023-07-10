"use strict";

var _express = _interopRequireDefault(require("express"));
var _chatbotController = _interopRequireDefault(require("../controllers/chatbotController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router();
var initWebRoutes = function initWebRoutes(app) {
  router.get('/', _chatbotController["default"].getHomePage);
  router.post('/setup-profile', _chatbotController["default"].setupProfile);
  router.get('/webhook', _chatbotController["default"].getWebHook);
  router.get('/messaging-webhook', _chatbotController["default"].getWebHook);
  router.post('/webhook', _chatbotController["default"].postWebHook);
  return app.use('/', router);
};
module.exports = initWebRoutes;