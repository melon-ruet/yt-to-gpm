let loginForm = document.getElementById('login_form');
let loginButton = document.getElementById('btn_login');
let username = document.getElementById('username');
let password = document.getElementById('password');
let baseUrl = 'http://127.0.0.1:8000';

loginButton.addEventListener("click", function () {
    $.Ajax({
        method: 'post',
        url: baseUrl + '/token/',
        data: {'username': username.value, 'password': password.value},
        success: function (data) {

        },
        error: function (data) {

        }
    });
});

chrome.storage.sync.get('token', function (data) {
    loginForm.style.display = 'block';
});
