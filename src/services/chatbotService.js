import request from 'request';
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED =
    'https://th.bing.com/th/id/R.773d15e33656ad2904165405a5a32317?rik=ofFDzfOn73Vz6w&pid=ImgRaw&r=0';

let callSendAPI = (sender_psid, response) => {
    // let now = new Date().getTime();
    // console.log('Goi hand send api: ', now);
    // console.log('response: ', response);

    return new Promise(async (resolve, reject) => {
        let request_body = {
            recipient: {
                id: sender_psid,
            },
            message: response,
        };

        await sendTypingOn(sender_psid);

        // Send the HTTP request to the Messenger Platform
        request(
            {
                uri: 'https://graph.facebook.com/v9.0/me/messages',
                qs: { access_token: PAGE_ACCESS_TOKEN },
                method: 'POST',
                json: request_body,
            },
            (err, res, body) => {
                if (!err) {
                    // console.log('message sent!')
                    sendMarkReadMessage(sender_psid);
                    resolve('done');
                } else {
                    console.error('Unable to send message:' + err);
                    sendMarkReadMessage(sender_psid);
                    reject(err);
                }
            }
        );
    });
};

let sendTypingOn = (sender_psid) => {
    return new Promise((resolve, reject) => {
        let request_body = {
            recipient: {
                id: sender_psid,
            },
            sender_action: 'typing_on',
        };

        // Send the HTTP request to the Messenger Platform
        request(
            {
                uri: 'https://graph.facebook.com/v9.0/me/messages',
                qs: { access_token: PAGE_ACCESS_TOKEN },
                method: 'POST',
                json: request_body,
            },
            (err, res, body) => {
                if (!err) {
                    console.log('sendTypingOn success!');
                    resolve('done');
                } else {
                    console.error('Unable to send message:' + err);
                    reject(err);
                }
            }
        );
    });
};

let sendMarkReadMessage = (sender_psid) => {
    return new Promise((resolve, reject) => {
        let request_body = {
            recipient: {
                id: sender_psid,
            },
            sender_action: 'mark_seen',
        };

        // Send the HTTP request to the Messenger Platform
        request(
            {
                uri: 'https://graph.facebook.com/v9.0/me/messages',
                qs: { access_token: PAGE_ACCESS_TOKEN },
                method: 'POST',
                json: request_body,
            },
            (err, res, body) => {
                if (!err) {
                    console.log('sendTypingOn success!');
                    resolve('done');
                } else {
                    console.error('Unable to send message:' + err);
                    reject(err);
                }
            }
        );
    });
};

let getUserName = (sender_psid) => {
    return new Promise((resolve, reject) => {
        request(
            {
                uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,gender,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
                method: 'GET',
            },
            (err, res, body) => {
                if (!err) {
                    body = JSON.parse(body);
                    let username = `${body.gender === 'male' ? 'Anh' : 'Chị'} ${body.last_name
                        } ${body.first_name}`;
                    resolve(username);
                } else {
                    console.error('Unable to send message:' + err);
                }
            }
        );
    });
};

//get started va reset menu
let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let response1 = {
                text: `Xin chào mừng ${username} đến với Khách sạn của chúng tôi.`,
            };
            // let response2 = getStartedTemplate(sender_psid);
            let response2 = getImageGetStartedTemplate();

            let response3 = getStartedQuickReplyTemplate(sender_psid);

            await callSendAPI(sender_psid, response1);
            await callSendAPI(sender_psid, response2);
            await callSendAPI(sender_psid, response3);
            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

let getStartedTemplate = (psid) => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Cửa hàng TechStore TvT xin kính chào quý khách',
                        subtitle: 'Dưới đây là các lựa chọn của nhà hàng',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'MENU CHÍNH',
                                payload: 'MAIN_MENU',
                            },
                            {
                                type: 'web_url',
                                title: 'ĐẶT BÀN',
                                url: `https://demo-chatbot-9rjf.onrender.com/reserve-table?psid=${psid}`,
                                webview_height_ratio: 'tall',
                                messenger_extensions: true,
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
    return response;
};

let getImageGetStartedTemplate = () => {
    let response = {
        attachment: {
            type: 'image',
            payload: {
                url: 'https://24hstore.vn/upload_images/images/2019/11/14/anh-gif-1-min.gif',
                is_reusable: true,
            },
        },
    };
    return response;
};

let getStartedQuickReplyTemplate = (psid) => {
    let response = {
        text: 'Dưới đây là các lựa chọn của khách sạn',
        quick_replies: [
            {
                content_type: 'text',
                title: 'MENU CHI NHÁNH',
                payload: 'MAIN_MENU',
                image_url:
                    'https://techstoretvt.github.io/kho-anh/5c28b0daffe956b70ff8.jpg',
            },
            {
                content_type: 'text',
                title: 'HD SU DUNG BOT',
                payload: 'GUIDE_TO_USE',
            },
        ],
    };
    return response;
};

let handleSendMainMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getMainMenuTemplate(sender_psid);

            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

let HandleXemPhongCN1 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [
                            {
                                title: 'Phòng 101',
                                subtitle:
                                    'Phòng có ban công, tầm nhìn đẹp, cửa sổ thoáng mát.',
                                image_url: "https://res.cloudinary.com/dultkpqjp/image/upload/v1702107825/quanlykhachsan/aptladyynhe7d77ovgbj.jpg",
                                buttons: [
                                    {
                                        type: 'postback',
                                        title: 'Xem chi tiết',
                                        payload: 'XEM_CN_1_PHONG_101',
                                    },
                                ],
                            },
                            {
                                title: 'Phòng 102',
                                subtitle:
                                    'Phòng có tầm nhìn ra hồ bơi của khách sạn. Cửa sooe kính rộng, thoáng mát bao quát toàn cảnh thành phố mang đến một không gian thanh bình và dễ chịu.',
                                image_url: "https://res.cloudinary.com/dultkpqjp/image/upload/v1702108115/quanlykhachsan/txqculhzh9em8fjjurdj.jpg",
                                buttons: [
                                    {
                                        type: 'postback',
                                        title: 'Xem chi tiết',
                                        payload: 'XEM_CN_1_PHONG_102',
                                    },
                                ],
                            },
                            {
                                title: 'Phòng VIP1',
                                subtitle:
                                    'Phòng có diện tích rộng rãi, thoáng mát, hệ thống cửa kính mang tầm nhìn bao quát, có thể nhìn về phía Bến Ninh Kiều một cách bao quát.',
                                image_url: "https://res.cloudinary.com/dultkpqjp/image/upload/v1702138753/quanlykhachsan/wnrngt3jrebrtz53aksx.jpg",
                                buttons: [
                                    {
                                        type: 'postback',
                                        title: 'Xem chi tiết',
                                        payload: 'XEM_CN_1_PHONG_VIP1',
                                    },
                                ],
                            },
                        ],
                    },
                },
            };

            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

let HandleXemChiTietCN1Phong101 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [
                            {
                                title: 'anh1',
                                subtitle:
                                    'gia',
                                image_url: "https://res.cloudinary.com/dultkpqjp/image/upload/v1702107825/quanlykhachsan/aptladyynhe7d77ovgbj.jpg",
                            },
                            {
                                title: 'anh 2',
                                subtitle:
                                    'gia 2',
                                image_url: "https://res.cloudinary.com/dultkpqjp/image/upload/v1702108115/quanlykhachsan/txqculhzh9em8fjjurdj.jpg",
                            },
                            {
                                title: 'anh 3',
                                subtitle: "gia 3",
                            },
                        ],
                    },
                },
            };

            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

const getMainMenuTemplate = (psid) => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'TBT Hotel - Cần Thơ',
                        subtitle:
                            'Mô tả chi nhánh khách sạn, giới thiệu sơ thông tin chi nhánh và các đặc điểm riêng biệt.',
                        image_url: "https://techstoretvt.github.io/kho-anh/cn1.jpg",
                        buttons: [
                            {
                                type: 'postback',
                                title: 'Xem phòng',
                                payload: 'XEM_PHONG_CN_1',
                            },
                        ],
                    },
                    {
                        title: 'TBT Hotel - Ngọc Lan',
                        subtitle:
                            'Mô tả chi nhánh khách sạn, giới thiệu sơ thông tin chi nhánh và các đặc điểm riêng biệt.',
                        image_url: "https://techstoretvt.github.io/kho-anh/cn2.jpg",
                        buttons: [
                            {
                                type: 'postback',
                                title: 'Xem phòng',
                                payload: 'XEM_PHONG_CN_2',
                            },
                        ],
                    },
                    {
                        title: 'TBT Hotel - Đà Lạt',
                        subtitle:
                            'Mô tả chi nhánh khách sạn, giới thiệu sơ thông tin chi nhánh và các đặc điểm riêng biệt.',
                        image_url: "https://techstoretvt.github.io/kho-anh/cn3.jpg",
                        buttons: [
                            {
                                type: 'postback',
                                title: 'Xem phòng',
                                payload: 'XEM_PHONG_CN_3',
                            },
                        ],
                    },
                    // {
                    //     title: 'GIO MO CUA',
                    //     subtitle:
                    //         'THU 2 10AM - 11PM | THU 7 5PM - 10PM | CHU NHAT 5PM - 9PM',
                    //     image_url: IMAGE_GET_STARTED,
                    //     buttons: [
                    //         {
                    //             type: 'web_url',
                    //             title: 'ĐẶT BÀN',
                    //             url: `https://demo-chatbot-9rjf.onrender.com/reserve-table?psid=${psid}`,
                    //             webview_height_ratio: 'tall',
                    //             messenger_extensions: true,
                    //         },
                    //     ],
                    // },
                    // {
                    //     title: 'KHONG GIAN NHA HANG',
                    //     subtitle:
                    //         'Nha hang co suc chua len den 300 khach ngoi va phuc vu cac bua tiec to',
                    //     image_url: IMAGE_GET_STARTED,
                    //     buttons: [
                    //         {
                    //             type: 'postback',
                    //             title: 'CHI TIET',
                    //             payload: 'SHOW_ROOM',
                    //         },
                    //     ],
                    // },
                ],
            },
        },
    };
    return response;
};

const handleSendLunchMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getLunchMenuTemplate();

            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

let getLunchMenuTemplate = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Mon trang mieng',
                        subtitle: 'Nha hang co mon trang mien hap dan',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'XEM CHI TIET',
                                payload: 'VIEW_APPETIZERS',
                            },
                        ],
                    },
                    {
                        title: 'Ca bay mau',
                        subtitle: 'Ca nuoc man va ca nuoc ngot',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'XEM CHI TIET',
                                payload: 'VIEW_FISH',
                            },
                        ],
                    },
                    {
                        title: 'Thit hun khoi',
                        subtitle: 'Dam bao chat luong hang dau',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'XEM CHI TIET',
                                payload: 'VIEW_MEAT',
                            },
                        ],
                    },
                    {
                        title: 'Quay tro lai',
                        subtitle: 'Quay tro lai menu chinh',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'QUAY TRO LAI',
                                payload: 'BACK_TO_MAIN_MENU',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

const handleSendDinnerMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDinnerMenuTemplate();

            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

let getDinnerMenuTemplate = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Mon trang mieng',
                        subtitle: 'Nha hang co mon trang mien hap dan',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'XEM CHI TIET',
                                payload: 'VIEW_APPETIZERS',
                            },
                        ],
                    },
                    {
                        title: 'Ca bay mau',
                        subtitle: 'Ca nuoc man va ca nuoc ngot',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'XEM CHI TIET',
                                payload: 'VIEW_FISH',
                            },
                        ],
                    },
                    {
                        title: 'Thit hun khoi',
                        subtitle: 'Dam bao chat luong hang dau',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'XEM CHI TIET',
                                payload: 'VIEW_MEAT',
                            },
                            {
                                type: 'web_url',
                                title: 'Xem chi tiet 2',
                                url: 'https://tranvanthoai.online/product/029a0615-fcaf-4336-9d4f-e200ff7685f9?name=%C4%91i%E1%BB%87n%20tho%E1%BA%A1i%20oneplus%20nord%20ce%203%20lite%20|%206.72%20inch%20ips%20lcd%20|%205000mah%20|%20snapdragon%20695%205g%20|%208gb%20256gb',
                                webview_height_ratio: 'tall',
                                messenger_extensions: true,
                            },
                        ],
                    },
                    {
                        title: 'Quay tro lai',
                        subtitle: 'Quay tro lai menu chinh',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'QUAY TRO LAI',
                                payload: 'BACK_TO_MAIN_MENU',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

let handleDetailViewAppetizer = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDetailViewAppetizerTemplate();

            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailViewAppetizerTemplate = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Dua hau Vmart',
                        subtitle: '50.000d/1kg',
                        image_url: IMAGE_GET_STARTED,
                    },
                    {
                        title: 'Xoa lac',
                        subtitle: '20.000/1 hu',
                        image_url: IMAGE_GET_STARTED,
                    },
                    {
                        title: 'Dua leo',
                        subtitle: '15.000/1kg',
                        image_url: IMAGE_GET_STARTED,
                    },
                    {
                        title: 'Quay tro lai',
                        subtitle: 'Quay tro lai menu chinh',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'QUAY TRO LAI',
                                payload: 'BACK_TO_MAIN_MENU',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

let handleDetailViewFish = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDetailViewFishTemplate();

            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailViewFishTemplate = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Ca duoi',
                        subtitle: '50.000d/1kg',
                        image_url: IMAGE_GET_STARTED,
                    },
                    {
                        title: 'Ca sac',
                        subtitle: '20.000/1kg',
                        image_url: IMAGE_GET_STARTED,
                    },
                    {
                        title: 'Ca loc',
                        subtitle: '25.000/1kg',
                        image_url: IMAGE_GET_STARTED,
                    },
                    {
                        title: 'Quay tro lai',
                        subtitle: 'Quay tro lai menu chinh',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'QUAY TRO LAI',
                                payload: 'BACK_TO_MAIN_MENU',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

let handleDetailViewMeat = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDetailViewMeatTemplate();

            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailViewMeatTemplate = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Thit ba chi',
                        subtitle: '60.000d/1kg',
                        image_url: IMAGE_GET_STARTED,
                    },
                    {
                        title: 'Thit bo',
                        subtitle: '80.000/1kg',
                        image_url: IMAGE_GET_STARTED,
                    },
                    {
                        title: 'Thit ga luoc',
                        subtitle: '25.000/1kg',
                        image_url: IMAGE_GET_STARTED,
                    },
                    {
                        title: 'Quay tro lai',
                        subtitle: 'Quay tro lai menu chinh',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'QUAY TRO LAI',
                                payload: 'BACK_TO_MAIN_MENU',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

let getImageRoomTemplate = () => {
    let response = {
        attachment: {
            type: 'image',
            payload: {
                url: 'https://bedental.vn/wp-content/uploads/2022/11/hot-girl_8.jpg',
                is_reusable: true,
            },
        },
    };
    return response;
};

let getButtonRoomsTemplate = (psid) => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'button',
                text: 'Nha hang co the phuc vu toi da 300 khach',
                buttons: [
                    {
                        type: 'postback',
                        title: 'MENU CHINH',
                        payload: 'MAIN_MENU',
                    },
                    {
                        type: 'web_url',
                        title: 'ĐẶT BÀN',
                        url: `https://demo-chatbot-9rjf.onrender.com/reserve-table?psid=${psid}`,
                        webview_height_ratio: 'tall',
                        messenger_extensions: true,
                    },
                ],
            },
        },
    };
    return response;
};

let handleShowDetailRooms = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getImageRoomTemplate();
            let response2 = getButtonRoomsTemplate(sender_psid);

            await callSendAPI(sender_psid, response1);
            await callSendAPI(sender_psid, response2);

            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

let getBotMediaTemplate = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'media',
                elements: [
                    {
                        media_type: 'iamge',
                        // attachment_id: "689508926322322",
                        // url: 'https://business.facebook.com/techstoretvt/photos/326899106968659',
                        url: 'https://www.facebook.com/photo.php?fbid=326899106968659',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Xem video hướng dẫn',
                                url: `https://quanlykhachsan.vercel.app/`,
                            },
                            {
                                type: 'web_url',
                                title: 'Ghé thăm Khách sạn',
                                url: `https://quanlykhachsan.vercel.app/`,
                            },
                            {
                                type: 'postback',
                                title: 'MENU CHI NHÁNH',
                                payload: 'MAIN_MENU',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

let handleGuideToUseBot = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            // let response1 = {
            //     text: `Xin chào ${username}, mình là chatbot TBT HoTel.\nĐể biết thêm thông tin, vui lòng xem video bên dưới 😊💕.`,
            // };


            let response2 = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [
                            {
                                title: `Xin chào ${username}`,
                                subtitle:
                                    'Mình là chatbot TBT HoTel. Để biết thêm thông tin, vui lòng xem video bên dưới 😊💕',
                                image_url: IMAGE_GET_STARTED,
                                buttons: [
                                    {
                                        type: 'web_url',
                                        title: 'Xem video hướng dẫn',
                                        url: `https://www.youtube.com/watch?v=ZJbyf1fBY_4&ab_channel=EmSuy`,
                                    },
                                    {
                                        type: 'web_url',
                                        title: 'Ghé thăm Khách sạn',
                                        url: `https://quanlykhachsan.vercel.app/`,
                                    },
                                    {
                                        type: 'postback',
                                        title: 'MENU CHI NHÁNH',
                                        payload: 'MAIN_MENU',
                                    },
                                ],
                            }
                        ]
                    },
                },
            };

            // let response3 = getBotMediaTemplate(sender_psid);

            // await callSendAPI(sender_psid, response1);
            await callSendAPI(sender_psid, response2);
            // await callSendAPI(sender_psid, response3);

            resolve('done');
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleGetStarted,
    handleSendMainMenu,
    handleSendLunchMenu,
    handleSendDinnerMenu,
    handleDetailViewAppetizer,
    handleDetailViewFish,
    handleDetailViewMeat,
    handleShowDetailRooms,
    callSendAPI,
    getUserName,
    handleGuideToUseBot,
    HandleXemPhongCN1,
    HandleXemChiTietCN1Phong101
};
