let loginBlock = document.getElementById('login-block');
let codeBlock = document.getElementById('code-block');
let loginButton = document.getElementById('btn_login');
let username = document.getElementById('username');
let password = document.getElementById('password');
let code = document.getElementById('code');
let baseUrl = 'http://127.0.0.1:8001';

function send_code(){
    $.Ajax({
        method: 'post',
        url: baseUrl + '/oauth/',
        data: {'code': code.value},
        success: function (data) {
            loginBlock.style.display = 'none';
            codeBlock.style.display = 'none';
        },
        error: function (data) {

        }
    });
}

loginButton.addEventListener("click", function (e) {
    e.preventDefault();

    $.Ajax({
        url: baseUrl + '/token/',
        data: {'username': username.value, 'password': password.value},
        success: function (data) {
            if (data['response']) {
                chrome.storage.sync.set({token: data['token']}, function () {
                    $.Ajax({
                        method: 'get',
                        url: baseUrl + '/oauth/',
                        data: {'token': data['token']},
                        success: function (data) {
                            window.open(data['url'], '_blank');
                            loginBlock.style.display = 'none';
                            codeBlock.style.display = 'block';
                            send_code();
                        },
                        error: function (data) {

                        }
                    });
                });
            }
        },
        error: function (data) {

        }
    });
});

chrome.storage.sync.get('token', function (data) {
    if(data['token']){
        loginBlock.style.display = 'none';
    }else{
        loginBlock.style.display = 'block';
    }
});

chrome.storage.sync.get('code', function (data) {
    if (data['code']){
        codeBlock.style.display = 'none';
    }else {
        codeBlock.style.display = 'block';

    }
});