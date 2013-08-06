define(['jquery', 'validator', 'common'],
function($, validator, common) { 
    // 禁用cache
    $.ajaxSetup({
        cache : false
    });

    return {
        init: function() {
            var username =
            validator.bind($("form#login #username"),
                           $("form#login #username").next(),
                           function(val) {return true;},
                           "< 请输入帐号",
                           "");

            var password =
            validator.bind($("form#login #password"),
                           $("form#login #password").next(),
                           function(val) {return true;},
                           "< 请输入密码",
                           "");

            $("form#login").submit(function(event) {
                // 输入有误无法提交
                if (!(username.valid && password.valid)) {
                    // stop form from submitting normally
                    event.preventDefault();
                }
            });

            // 进入登录页面，默认由username输入框获取焦点
            $("form#login #username").focus();
        }
    }
});
