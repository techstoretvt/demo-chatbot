import request from 'request';
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = "https://th.bing.com/th/id/R.773d15e33656ad2904165405a5a32317?rik=ofFDzfOn73Vz6w&pid=ImgRaw&r=0"

let callSendAPI = (sender_psid, response) => {
    let now = new Date().getTime();
    console.log('Goi hand send api: ', now);
    console.log('response: ', response);

    return new Promise((resolve, reject) => {
        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            "message": response
        }

        // Send the HTTP request to the Messenger Platform
        request({
            "uri": "https://graph.facebook.com/v9.0/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                // console.log('message sent!')
                resolve('done')
            } else {
                console.error("Unable to send message:" + err);
                reject(err)
            }
        });
    })

}

let getUserName = (sender_psid) => {
    return new Promise((resolve, reject) => {
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,gender,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                body = JSON.parse(body);
                let username = `${body.gender === 'male' ? 'Anh' : 'Chị'} ${body.last_name} ${body.first_name}`
                resolve(username)
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    })

}

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let response1 = { "text": `Xin chào mừng ${username} đến với Website mua sắm trực tiếp của chúng tôi.` }
            let response2 = sendGetStartedTemplate();

            await callSendAPI(sender_psid, response1);
            await callSendAPI(sender_psid, response2);
            resolve('done')

        } catch (error) {
            reject(error);
        }
    })
}

let sendGetStartedTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Cửa hàng TechStore TvT xin kính chào quý khách",
                        "subtitle": "Dưới đây là các lựa chọn của nhà hàng",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "MENU CHÍNH",
                                "payload": "MAIN_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "ĐẶT BÀN",
                                "payload": "RESERVER_TABLE",
                            },
                            {
                                "type": "postback",
                                "title": "HƯỚNG DẪN SỬ DỤNG BOT",
                                "payload": "GUIDE_TO_USE",
                            }
                        ],
                    },
                ]
            }
        }
    }
    return response;
}

module.exports = {
    handleGetStarted
}