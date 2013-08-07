define(['jquery', 'validator', 'common'],
function($, validator, common) { 
    // 禁用cache
    $.ajaxSetup({
        cache : false
    });

    return {
        init: function() {
            /* 由于使用了cleditor（动态插入了iframe元素）的缘故，对原来的输入合法性验证做了修改 */

            var title =
            validator.bind($("form#new_post #title"),
                           $("span#for_title"),
                           function(val) {return true;},
                           "^ 请输入标题",
                           "");

            
            $("form#new_post").submit(function(event) {
                // 输入标题为空，不能提交
                if (!title.valid) {
                    // stop form from submitting normally
                    event.preventDefault();
                }

                // 输入内容为空，不能提交
                if ($("form#new_post #content").val() == "<br>") {
                    // stop form from submitting normally
                    event.preventDefault();

                    $("span#for_content").html("^ 请输入内容");
                }
                else {
                    $("span#for_content").html("");
                }
            });

            // 进入登录页面，默认由title输入框获取焦点
            $("form#new_post #title").focus();
        }
    }
});
