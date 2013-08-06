define(['jquery', 'validator', 'common'],
function($, validator, common) { 
    // 禁用cache
    $.ajaxSetup({
        cache : false
    });

    return {
        init: function() {
            var title =
            validator.bind($("form#new_post #title"),
                           $("form#new_post #title").next(),
                           function(val) {return true;},
                           "< 请输入标题",
                           "");

            var content =
            validator.bind($("form#new_post #content"),
                           $("form#new_post #content").next(),
                           function(val) {return true;},
                           "< 请输入内容",
                           "");

            $("form#new_post").submit(function(event) {
                // 输入有误无法提交
                if (!(title.valid && content.valid)) {
                    // stop form from submitting normally
                    event.preventDefault();
                }
            });

            // 进入登录页面，默认由title输入框获取焦点
            $("form#new_post #title").focus();
        }
    }
});
