(function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/messenger.Extensions.js';
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'Messenger');

window.extAsyncInit = function () {
    // the Messenger Extensions JS SDK is done loading
    console.log('file: reserve-table.js:15 - loading:', MessengerExtensions);

    MessengerExtensions.getContext(
        '1225198088353816',
        function success(thread_context) {
            // success
            //set psid to input
            $('#psid').val(thread_context.psid);
            handleClickButtonReserveTable();
            // $('#check-error').text('khong loi');
            console.log('id: ', thread_context);
        },
        function error(err) {
            // error
            console.log('Lỗi đặt bàn Eric bot', err);
            // $('#check-error').text('co loi');
        }
    );

    MessengerExtensions.getUserID(
        function success(thread_context) {
            // success
            //set psid to input

            console.log('success: ', thread_context);
        },
        function error(err) {
            // error
            console.log('error');
        }
    );
};

//validate inputs
function validateInputFields() {
    const EMAIL_REG =
        /[a-zA-Z][a-zA-Z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/g;

    let email = $('#email');
    let phoneNumber = $('#phoneNumber');

    if (!email.val().match(EMAIL_REG)) {
        email.addClass('is-invalid');
        return true;
    } else {
        email.removeClass('is-invalid');
    }

    if (phoneNumber.val() === '') {
        phoneNumber.addClass('is-invalid');
        return true;
    } else {
        phoneNumber.removeClass('is-invalid');
    }

    return false;
}

handleClickButtonReserveTable();

function handleClickButtonReserveTable() {
    let params = new URLSearchParams(document.location.search);
    let psid = params.get('psid');
    let idPhong = params.get('idPhong');
    // $('#check-error').text(psid);
    console.log('vao 1', psid);
    document
        .getElementById('btnReserveTable')
        .addEventListener('click', function (e) {
            console.log('vao');

            let check = validateInputFields(); //return true or false

            let tuNgay = $('#tuNgay').val()
            tuNgay = Date.parse(tuNgay) / 1000

            let denNgay = $('#denNgay').val()
            denNgay = Date.parse(denNgay) / 1000

            let data = {
                psid: psid,
                idPhong,
                customerName: $('#customerName').val(),
                email: $('#email').val(),
                phoneNumber: $('#phoneNumber').val(),
                tuNgay,
                denNgay
            };

            // console.log("data: ", data);

            // return

            if (!check) {
                //close webview
                MessengerExtensions.requestCloseBrowser(
                    function success() {
                        // webview closed
                    },
                    function error(err) {
                        // an error occurred
                        console.log(err);
                    }
                );

                //send data to node.js server
                console.log(
                    'sfsd: ',
                    `${window.location.origin}/reserve-table-ajax`
                );

                fetch('/reserve-table-ajax', {
                    method: 'POST', // Thay đổi thành phương thức POST
                    headers: {
                        'Content-Type': 'application/json', // Kiểu dữ liệu truyền đi (application/json, application/x-www-form-urlencoded, v.v.)
                        // Các headers khác (nếu cần)
                    },
                    body: JSON.stringify(data),
                })
                    .then((response) => response.json()) // Chuyển đổi dữ liệu trả về thành JSON
                    .then((data) => {
                        // Xử lý dữ liệu khi API trả về thành công
                        console.log(data);
                    })
                    .catch((error) => {
                        // Xử lý lỗi khi gọi API không thành công
                        console.log(error);
                    });
            }
        });
}
