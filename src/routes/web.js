import express from 'express';
import chatbotController from '../controllers/chatbotController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', chatbotController.getHomePage);
    router.post('/setup-profile', chatbotController.setupProfile);
    router.post(
        '/setup-persistent-menu',
        chatbotController.setupPersistentMenu
    );

    router.get('/webhook', chatbotController.getWebHook);
    router.get('/messaging-webhook', chatbotController.getWebHook);
    router.post('/webhook', chatbotController.postWebHook);
    router.post('/webhook', chatbotController.postWebHook);

    router.get('/reserve-table', chatbotController.handleReserveTable);
    router.post(
        '/reserve-table-ajax',
        chatbotController.handlePostReserveTable
    );

    return app.use('/', router);
};

module.exports = initWebRoutes;
