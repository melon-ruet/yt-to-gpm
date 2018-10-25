
jQuery.Ajax = function (options) {
    let defaults = {
        method: 'POST', // GET, POST, PUT, DELETE
        url: '.',
        dataType: 'json',
        data: {},
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        processData: true,
        token: '',
        success: function () {},
        error: function () {}
    };

    let o = jQuery.extend(defaults, options);

    function safeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajax({
        method: o.method,
        url: o.url,
        dataType: o.dataType,
        data: o.data,
        contentType: o.contentType,
        processData: o.processData,
        success: function (data) {
            o.success(data);
        },
        error: function (data) {
          o.error(data);
        },
        beforeSend: function (xhr, settings) {
            if (!safeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            }
        }
    });
};
