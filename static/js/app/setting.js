define(['jquery', 'validator', 'common'],
function($, validator, common) { 
    return {
        init: function() {
            var email = 
            validator.bind($("form#account_settings #email"),
                           $("form#account_settings #email").next().next(),
                           function(val) {return val.match(common.email_pattern);},
                           "< 请输入邮箱",
                           "< 邮箱格式不对");

            /*var ori_password =
            validator.bind($("form#account_settings #ori_password"),
                           $("form#account_settings #ori_password").next(""),
                           function(val) {return val.match(common.password_pattern);},
                           "< 请输入密码",
                           "< 密码格式不对");*/

            var new_password =
            validator.bind($("form#account_settings #new_password"),
                           $("form#account_settings #new_password").next(),
                           function(val) {return val.match(common.password_pattern);},
                           "< 请输入密码",
                           "< 密码格式不对");

            var new_password_again =
            validator.bind($("form#account_settings #new_password_again"),
                           $("form#account_settings #new_password_again").next(),
                           function(val) {return (val==$("#new_password").val());},
                           "< 请再次输入密码",
                           "< 密码不匹配");

            var email_modified = false;
            $("form#account_settings #modify_email").click(function(event) {
                // stop form from submitting normally
                event.preventDefault();

                if ($(this).html() == "更改") {
                    // 开始修改 
                    $(this).html("确定");
                    $(this).prev().removeAttr("disabled");
                    $(this).prev().focus();

                    // 邮箱未确认
                    email_modified = false;
                } else {
                    if (email.valid) {
                        // 确认修改
                        $(this).html("更改");
                        $(this).prev("#email").attr("disabled", "true");

                        // 邮箱已修改，且确认无误
                        email_modified = true;
                    }
                }
            });

            var password_modified = false;
            $("form#account_settings #modify_password").click(function(event) {
                // stop form from submitting normally
                event.preventDefault();

                if ($(this).html() == "更改") {
                    // 开始修改 
                    $(this).html("确定");
                    $(".optional").show();
                    //$(".optional #ori_password").focus();
                    $(".optional #new_password").focus();

                    // 密码未确认
                    email_modified = false;
                } else {
                    if (/*ori_password.valid && */new_password.valid && new_password_again.valid) {
                        // 确认修改
                        $(this).html("更改");
                        $(".optional").hide();

                        // 密码已修改，且确认无误
                        password_modified = true;
                    }
                }
            });

            $("form#account_settings").submit(function(event) {
                // stop form from submitting normally
                event.preventDefault();

                var email_newval = "";
                var password_newval = "";

                if (email_modified) {
                    email_newval = $("#email").val();
                }

                if (password_modified) {
                    password_newval = $("#new_password").val();
                }

                // 邮箱和密码均未作修改，不提交
                if (email_newval == "" && password_newval == "") {
                    $(".submit_tip").removeClass("ok");
                    $(".submit_tip").addClass("error");
                    $(".submit_tip").html("请更改并确定");
                    return;
                }

                /* Send the data using post */
                var url = window.location.href;
                $.post(url, {email: email_newval, password: password_newval},
                    function(data) {
                        if (data.result) {
                            $(".submit_tip").removeClass("error");
                            $(".submit_tip").addClass("ok");
                            $(".submit_tip").html("保存成功");
                        } else {
                            $(".submit_tip").removeClass("ok");
                            $(".submit_tip").addClass("error");
                            $(".submit_tip").html("保存失败");
                        }
                    }, "json");
            });

            // 初始时，隐藏密码修改域
            $(".optional").hide();
        }
    }
});
