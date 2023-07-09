require('dotenv').config();
import nodemailer from 'nodemailer'
import request from 'request';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS_EMAIL,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

let getHomePage = (req, res) => {

    return res.send('Hello home page');
}

let postWebHook = (req, res) => {

    let body = req.body;

    if (body.object === "page") {
        // Returns a '200 OK' response to all requests
        body.entry.forEach(function (entry) {


            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        })


        res.status(200).send("EVENT_RECEIVED");
        // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

let getWebHook = (req, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS_EMAIL,
        },
        tls: {
            rejectUnauthorized: false,
        }
    });


    let info = transporter.sendMail({
        from: `"TechStoreTvT ⚔ ⚓ 👻" <${process.env.EMAIL}>`,
        to: 'ngoantung2565@gmail.com',
        subject: 'log demo chatbot' + 'sfsdf',
        html: 'vao route get webhook',
    });

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }

}


// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Check if the message contains text
    if (received_message.text) {

        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Đây có phải bức ảnh bạn đã gửi không?",
                            "subtitle": "Nhấn nút ở dưới để trả lời",
                            "image_url": attachment_url,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Đúng!",
                                    "payload": "yes",
                                },
                                {
                                    "type": "postback",
                                    "title": "Không đúng!",
                                    "payload": "no",
                                }
                            ],
                        },
                        {
                            "title": "Đây có phải bức ảnh bạn đã gửi không?",
                            "subtitle": "Nhấn nút ở dưới để trả lời",
                            "image_url": "https://bizweb.dktcdn.net/100/438/408/files/anh-gai-cute-chupinstagram-yody-vn1.jpg?v=1681963785998",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Đúng!",
                                    "payload": "yes",
                                },
                                {
                                    "type": "postback",
                                    "title": "Không đúng!",
                                    "payload": "no",
                                }
                            ],
                        },
                        {
                            "title": "Đây có phải bức ảnh bạn đã gửi không?",
                            "subtitle": "Nhấn nút ở dưới để trả lời",
                            "image_url": "https://bizweb.dktcdn.net/100/438/408/files/anh-gai-cute-chupinstagram-yody-vn1.jpg?v=1681963785998",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Đúng!",
                                    "payload": "yes",
                                },
                                {
                                    "type": "postback",
                                    "title": "Không đúng!",
                                    "payload": "no",
                                }
                            ],
                        },
                    ]
                }
            }
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}


module.exports = {
    getHomePage,
    getWebHook,
    postWebHook
}