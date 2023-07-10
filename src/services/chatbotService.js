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
            let response2 = getStartedTemplate();

            await callSendAPI(sender_psid, response1);
            await callSendAPI(sender_psid, response2);
            resolve('done')

        } catch (error) {
            reject(error);
        }
    })
}

let getStartedTemplate = () => {
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

let handleSendMainMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getMainMenuTemplate();

            await callSendAPI(sender_psid, response1);

            resolve('done')

        } catch (error) {
            reject(error);
        }
    })
}

const getMainMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Menu cua nha hang",
                        "subtitle": "Chung toi rat han hanh mang den cho banj thuc don phong phu cho bua sang va bua toi",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "BUA TRUA",
                                "payload": "LUNCH_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "BUA TOI",
                                "payload": "DINNER_MENU",
                            },
                        ],
                    },
                    {
                        "title": "GIO MO CUA",
                        "subtitle": "THU 2 10AM - 11PM | THU 7 5PM - 10PM | CHU NHAT 5PM - 9PM",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "DAT BAN",
                                "payload": "RESERVER_TABLE",
                            },
                        ],
                    },
                    {
                        "title": "KHONG GIAN NHA HANG",
                        "subtitle": "Nha hang co suc chua len den 300 khach ngoi va phuc vu cac bua tiec to",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "CHI TIET",
                                "payload": "SHOW_ROOM",
                            },
                        ],
                    },
                ]
            }
        }
    }
    return response;
}

const handleSendLunchMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getLunchMenuTemplate();

            await callSendAPI(sender_psid, response1);

            resolve('done')

        } catch (error) {
            reject(error);
        }
    })
}

let getLunchMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Mon trang mieng",
                        "subtitle": "Nha hang co mon trang mien hap dan",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIET",
                                "payload": "VIEW_APPETIZERS",
                            },
                        ],
                    },
                    {
                        "title": "Ca bay mau",
                        "subtitle": "Ca nuoc man va ca nuoc ngot",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIET",
                                "payload": "VIEW_FISH",
                            },
                        ],
                    },
                    {
                        "title": "Thit hun khoi",
                        "subtitle": "Dam bao chat luong hang dau",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIET",
                                "payload": "VIEW_MEAT",
                            },
                        ],
                    },
                ]
            }
        }
    }
    return response;
}

const handleSendDinnerMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDinnerMenuTemplate();

            await callSendAPI(sender_psid, response1);

            resolve('done')

        } catch (error) {
            reject(error);
        }
    })
}

let getDinnerMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Menu cua nha hang",
                        "subtitle": "Chung toi rat han hanh mang den cho banj thuc don phong phu cho bua sang va bua toi",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "BUA TRUA",
                                "payload": "LUNCH_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "BUA TOI",
                                "payload": "DINNER_MENU",
                            },
                        ],
                    },
                    {
                        "title": "GIO MO CUA",
                        "subtitle": "THU 2 10AM - 11PM | THU 7 5PM - 10PM | CHU NHAT 5PM - 9PM",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "DAT BAN",
                                "payload": "RESERVER_TABLE",
                            },
                        ],
                    },
                    {
                        "title": "KHONG GIAN NHA HANG",
                        "subtitle": "Nha hang co suc chua len den 300 khach ngoi va phuc vu cac bua tiec to",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "CHI TIET",
                                "payload": "SHOW_ROOM",
                            },
                        ],
                    },
                ]
            }
        }
    }
    return response;
}

module.exports = {
    handleGetStarted,
    handleSendMainMenu,
    handleSendLunchMenu,
    handleSendDinnerMenu
}