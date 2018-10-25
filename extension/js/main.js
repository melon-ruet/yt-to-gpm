let loginForm = document.getElementById('login_form');
let loginButton = document.getElementById('btn_login');
let baseUrl = 'http://127.0.0.1:8000';

loginButton.addEventListener("click", function () {
    let username = document.getElementById('username');
    let password = document.getElementById('password');

    $.ajax({
        method: 'post',
        url: baseUrl + '/token/',
        dataType: 'json',
        data: {'username': username.val(), 'password': password.val()},
        success: function (data) {

        },
        error: function (data) {

        }
    });
});

chrome.storage.sync.get('token', function (data) {
    loginForm.style.display = 'block';
});
