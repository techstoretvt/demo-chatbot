require('dotenv').config();
import nodemailer from 'nodemailer'

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

let getHomePage = (req, res) => {
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
        html: 'sender_psid',
    });
    return res.send('Hello home page');
}

let postWebHook = (req, res) => {
    let body = req.body;

    if (body.object === "page") {
        // Returns a '200 OK' response to all requests
        body.entry.forEarch(function (entry) {


            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);


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
                html: 'sender_psid' + sender_psid,
            });

        })


        res.status(200).send("EVENT_RECEIVED");
        // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

let getWebHook = (req, res) => {


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

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

}


module.exports = {
    getHomePage,
    getWebHook,
    postWebHook
}