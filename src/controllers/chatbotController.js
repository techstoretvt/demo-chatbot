require('dotenv').config();
import nodemailer from 'nodemailer';
import request from 'request';
import chatbotService from '../services/chatbotService';
const { GoogleSpreadsheet } = require('google-spreadsheet');
import moment from 'moment';
import { JWT } from 'google-auth-library';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const PRIVATE_KEY =
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDlCJNK4rOfOhlR\nsqdCZQT82a0sj7x3YIEzljdaRc7QzJUtuBqqw7qkVyZxSy2GlgaDMyzZ0wvqe14E\nYwgXFZCU9cQUPWlcp4K2wqgcoihS/DN6+qjn/HMVtXD16Or4g5pTb5KYvhqzI4jN\njKL8XaHZqNOSzPgNqzHCuZ6et8cSa8QatDWUJcFPiT5aH4EfM+5iBpKqJUf+ocel\ntO04OFjWsDhNDqiTVrLyEP1HwNZBr2dxYrEl7f/pvjs68X9qtVxFNCprfzqrWe+g\nxwLyltx3pl8DRTymmIsCYyOU28tr0dXeN08K0K48mlXhflFv6yL15hBwRIuJPlPe\nj9a44TvTAgMBAAECggEAKrprVDyv+wQpRhMY3iuffxaTFq2oIPNJl1iucfJ1D4Ij\nUJi4rOQAFXnGy7sVPrcNdvucofScE/44/4OENl5JD2k8T/RXDDiaC8OL/m+IK1cu\nuYI68bCovcOQU+hEseFHcMpvZHyO2Z3G/2X94CwNrmAvPINtwYsPKP9dJsotYvOK\nk2IptpopJSigi9JqDxyOy6ssiWXfmA4g14T++uoH3H7GQQpPXKgQwNdx3obnENaT\nFdTvgfAzJUlZi5TKwfU/BFh8Za4PQ4qSKSJfK2J20wV81d5mzwnyG1On+fs8rtj7\nu41kcAhAvi8/pfzVOXOGEgyx8odUeLnQZrqsNqbL7QKBgQD0ouWxOzt+Um/syOu9\nGuYnbEUIpS6q6M5A/yo9QwAt9x2GJ1VCuKrMLNEvkwP591mOYEFtIuOaBCAYCtj4\nep3HBDVE93m3BxBwdEdndSKt34M7LUmdrdpPXsjY0EPxFqsi8VRuRXxXYAkmFcRU\nthLBatfD4FyZ5HmLRe0m7AoWVQKBgQDvrCL1WvWNeCgziwFev7/8c8B3jOqdwbvu\nTTkcxnQw+eu65JWYgRQqLBqHfZdr05+quOrMansolyRH9Og56Wb9y8i0DoOwRO2I\nRGNgXaq+DVpTTjxuZX2KpLT4qqrUb8/4thwHYd6OfCsN1Ee2g7RbRUuAU7P/FbFG\n7O5LpXShhwKBgQC5mDwaUY25MGGpimUOerHRhtp4zJizIRwZQ3yQLZydQrUrafvN\nOryZWgb5yNdjdLyEv5HjcmyqFCclFlW1bZD1w8OGJxo4OSvHpO/nFX7R2ph89Ma8\n0YCmZoqJsrdY2JHNWLltT1oeD8XhFvJ0Mg3Yn25CNJ0MQ8HSX6KjvL+KYQKBgChF\ngEpB0mjG+9pNTRmilpvQx1JPN0zytKVCDIqtPfDMzbNFnW1WoxDDAGIr1DmmAXoq\nQCnA6pjTbKE6oZq5gTi7+SloFvCTZGY1N42Fr57nl3nP94+FNicJre7qnnG7p/Je\nhy8mXsMKUiGsvbAJSVDcv+b8KY5/Ep6cSR4k2wgZAoGAYUIm5a6gOH2yi0tKSaEi\nUAOPwmmZCRFQbQ6zMRFLwluQZNOrT3dOXOdhQiI9W+8oY4ubENXJFYKfUonBd7Ms\nBEglSKC+af2DwsR99TsoNMnzFhddHmd/nh3xLMU8Y3jvGFeN7OMbtEQ8fcDLZBmW\nyDj/UwekETmblpxhDoOcsRI=\n-----END PRIVATE KEY-----\n';
const CLIENT_EMAIL =
    'demo-sheet@plucky-snowfall-392705.iam.gserviceaccount.com';
const SHEET_ID = '1eC6LXKsKrtaIUI4SPmQrYvT5SKI4-eAHwKqbd2ZTcNA';

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS_EMAIL,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

let writeDataToGoogleSheet = async (data) => {
    try {
        let currentDate = new Date();

        const format = 'HH:mm DD/MM/YYYY';

        let formatedDate = moment(currentDate).format(format);

        const serviceAccountAuth = new JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);

        await doc.loadInfo(); // loads document properties and worksheets
        console.log('doc.title: ', doc.title);

        const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
        console.log('sheet.title: ', sheet.title);
        console.log('sheet.rowCount: ', sheet.rowCount);

        // adding / removing sheets
        await sheet.addRow({
            'Tên Facebook': data.username,
            Email: data.email,
            'Số điện thoại': "'" + data.phoneNumber,
            'Thời gian': formatedDate,
            'Tên khách hàng': data.customerName,
        });
    } catch (e) {
        console.log('file: chatbotController.js:63 - e:', e);
    }
};

let getHomePage = (req, res) => {
    return res.render('HomePage.ejs');
};

let postWebHook = (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        // Returns a '200 OK' response to all requests
        body.entry.forEach(function (entry) {
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            // console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            // console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        res.status(200).send('EVENT_RECEIVED');
        // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebHook = (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Respond with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

// Handles messages events
async function handleMessage(sender_psid, received_message) {
    let response;

    // Check if the message contains text

    //check messages for quick reply
    if (received_message.quick_reply && received_message.quick_reply.payload) {
        if (received_message.quick_reply.payload === 'MAIN_MENU') {
            await chatbotService.handleSendMainMenu(sender_psid);
        }

        if (received_message.quick_reply.payload === 'GUIDE_TO_USE') {
            await chatbotService.handleGuideToUseBot(sender_psid);
        }
        return;
    }
    if (received_message.text) {
        // Create the payload for a basic text message
        if (received_message.text === 'Mở menu') {
            chatbotService.handleSendMainMenu(sender_psid);
            return;
        }
        response = {
            text: `You sent the message: "${received_message.text}". Now send me an image!`,
        };
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [
                        {
                            title: 'Cửa hàng TechStore TvT xin kính chào quý khách',
                            subtitle: 'Dưới đây là các lựa chọn của nhà hàng',
                            image_url: attachment_url,
                            buttons: [
                                {
                                    type: 'postback',
                                    title: 'MENU CHÍNH',
                                    payload: 'MAIN_MENU',
                                },
                                {
                                    type: 'postback',
                                    title: 'ĐẶT BÀN',
                                    payload: 'RESERVER_TABLE',
                                },
                                {
                                    type: 'postback',
                                    title: 'HƯỚNG DẪN SỬ DỤNG BOT',
                                    payload: 'GUIDE_TO_USE',
                                },
                            ],
                        },
                    ],
                },
            },
        };
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    switch (payload) {
        case 'yes':
            response = { text: 'Thanks!' };
            break;
        case 'no':
            response = { text: 'Oops, try sending another image.' };
            break;
        case 'RESTART_BOT':
        case 'GET_STARTED':
            await chatbotService.handleGetStarted(sender_psid);
            break;
        case 'BACK_TO_MAIN_MENU':
        case 'MAIN_MENU':
            await chatbotService.handleSendMainMenu(sender_psid);
            break;
        case 'GUIDE_TO_USE':
            await chatbotService.handleGuideToUseBot(sender_psid);
            break;
        case 'LUNCH_MENU':
            await chatbotService.handleSendLunchMenu(sender_psid);
            break;
        case 'DINNER_MENU':
            await chatbotService.handleSendDinnerMenu(sender_psid);
            break;
        case 'VIEW_APPETIZERS':
            await chatbotService.handleDetailViewAppetizer(sender_psid);
            break;
        case 'VIEW_FISH':
            await chatbotService.handleDetailViewFish(sender_psid);
            break;
        case 'VIEW_MEAT':
            await chatbotService.handleDetailViewMeat(sender_psid);
            break;
        case 'SHOW_ROOM':
            await chatbotService.handleShowDetailRooms(sender_psid);
            break;
        // case 'RESERVER_TABLE':
        //     await chatbotService.handleShowDetailRooms(sender_psid);
        //     break;
        default:
            response = {
                text: `opp! I don't know responese with postback ${payload}`,
            };
    }

    // Send the message to acknowledge the postback
    // callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        message: response,
    };

    // Send the HTTP request to the Messenger Platform
    request(
        {
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                // console.log('message sent!')
            } else {
                console.error('Unable to send message:' + err);
            }
        }
    );
}

const setupProfile = async (req, res) => {
    //call profile facebook api
    let request_body = {
        get_started: {
            payload: 'GET_STARTED',
        },
        whitelisted_domains: ['https://demo-chatbot-9rjf.onrender.com'],
    };
    await request(
        {
            uri:
                'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' +
                PAGE_ACCESS_TOKEN,
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            console.log('body:', body);
            if (!err) {
                console.log('Setup profile sucess');
            } else {
                console.error('Unable to setup profile:' + err);
            }
        }
    );

    return res.json({
        message: 'ok',
    });
};

const setupPersistentMenu = async (req, res) => {
    //call profile facebook api
    let request_body = {
        persistent_menu: [
            {
                locale: 'default',
                composer_input_disabled: false,
                call_to_actions: [
                    {
                        type: 'web_url',
                        title: 'Youtube of TechStoreTvT',
                        url: 'https://tranvanthoai.online/',
                        webview_height_ratio: 'full',
                    },
                    {
                        type: 'web_url',
                        title: 'Facebook TechStoreTvT',
                        url: 'https://www.facebook.com/tranv.thoai.7/',
                        webview_height_ratio: 'full',
                    },
                    {
                        type: 'postback',
                        title: 'Restart bot',
                        payload: 'RESTART_BOT',
                    },
                ],
            },
        ],
    };
    await request(
        {
            uri:
                'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' +
                PAGE_ACCESS_TOKEN,
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            console.log('body:', body);
            if (!err) {
                console.log('Setup persistent menu sucess');
            } else {
                console.error('Unable to setup persistent menu:' + err);
            }
        }
    );

    return res.json({
        message: 'ok',
    });
};

let handleReserveTable = (req, res) => {
    return res.render('reserve-table.ejs');
};

let handlePostReserveTable = async (req, res) => {
    try {
        let username = await chatbotService.getUserName(req.body.psid);
        let data = {
            username: username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            customerName: req.body.customerName,
        };
        await writeDataToGoogleSheet(data);

        console.log('psid: ', req.body.psid);
        await chatbotService.handleSendMainMenu(req.body.psid);
        let customerName = '';
        if (req.body.customerName === '') {
            customerName = username;
        } else customerName = req.body.customerName;

        let response1 = {
            text: `---Thong tin khach hang dat ban---
            \nHo va ten: ${customerName}
            \nDia chi email: ${req.body.email}
            \nSo dien thoai: ${req.body.phoneNumber}
            `,
        };

        await chatbotService.callSendAPI(req.body.psid, response1);
        return res.status(200).json({
            message: 'ok',
        });
    } catch (error) {
        console.log('file: chatbotController.js:305 - error:', error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

const handleTestExcel = async (req, res) => {
    try {
        let currentDate = new Date();

        const format = 'HH:mm DD/MM/YYYY';

        let formatedDate = moment(currentDate).format(format);
        const serviceAccountAuth = new JWT({
            // env var values here are copied from service account credentials generated by google
            // see "Authentication" section in docs for more info
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);

        await doc.loadInfo(); // loads document properties and worksheets
        console.log('doc.title: ', doc.title);

        const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
        console.log('sheet.title: ', sheet.title);
        console.log('sheet.rowCount: ', sheet.rowCount);

        // adding / removing sheets
        const newRow = await sheet.addRow({
            'Tên Facebook': 'Hỏi Dân IT',
            Email: 'haryphamdev@gmail.com',
            'Số điện thoại': `'0321456789`,
            'Thời gian': formatedDate,
            'Tên khách hàng': 'Eric',
        });

        return res.send('Writing data to Google Sheet succeeds!');
    } catch (e) {
        console.log('file: chatbotController.js:369 - e:', e);
        return res.send(
            'Oops! Something wrongs, check logs console for detail ... '
        );
    }
};

module.exports = {
    getHomePage,
    getWebHook,
    postWebHook,
    setupProfile,
    setupPersistentMenu,
    handleReserveTable,
    handlePostReserveTable,
    handleTestExcel,
};
