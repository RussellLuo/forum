define(['jquery', 'validator', 'common'],
function($, validator, common) { 
    return {
        init: function() {
            var email = 
            validator.bind($("form#password #email"),
                           $("form#password #email").next(),
                           function(val) {return val.match(common.email_pattern);},
                           "< 请输入邮箱",
                           "< 邮箱格式不对");

            $("form#password").submit(function(event) {
                // stop form from submitting normally
                event.preventDefault();

                // 清空原有状态提示
                $(".submit_tip").html("");

                // 输入有误无法提交
                if (!(email.valid)) {
                    return;
                }

                // 处理时间较长，为了避免重复提交，这里先去使能“确定”按钮
                $("#find_btn").attr("disabled", "true");
                // 提示正在处理中
                $(".submit_tip").html("正在处理中...");

                /* Send the data using post */
                var url = window.location.href;
                var email_val = $("form#password #email").val();
                $.post(url, {email: email_val},
                    function(data) {
                        if (data.result) {
                            $(".submit_tip").removeClass("error");
                            $(".submit_tip").addClass("ok");
                            $(".submit_tip").html("邮件发送成功");
                        } else {
                            $(".submit_tip").removeClass("ok");
                            $(".submit_tip").addClass("error");
                            $(".submit_tip").html("邮箱未注册或邮件发送失败");
                        }

                        // 处理完毕后，再恢复使能“确定”按钮
                        $("#find_btn").removeAttr("disabled");
                    }, "json");
            });

            // 进入注册页面，默认由email输入框获取焦点
            $("form#password #email").focus();
        }
    }
});
