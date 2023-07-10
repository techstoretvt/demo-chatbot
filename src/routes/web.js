import express from 'express';
import chatbotController from '../controllers/chatbotController'

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', chatbotController.getHomePage);
    router.post('/setup-profile', chatbotController.setupProfile)
    router.post('/setup-persistent-menu', chatbotController.setupPersistentMenu)

    router.get('/webhook', chatbotController.getWebHook)
    router.get('/messaging-webhook', chatbotController.getWebHook)
    router.post('/webhook', chatbotController.postWebHook)

    return app.use('/', router);

}

module.exports = initWebRoutes;