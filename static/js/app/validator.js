define(['jquery'],
function($) {
    return {
        /* 如果输入框的内容为空或非法，在提示栏中给出提示，并返回验证结果
           入参：input_element  输入框控件
                 tip_element    提示栏控件
                 validate_func  验证处理函数
                 null_tip       输入为空提示
                 invalid_tip    输入非法提示
           返回值：result       验证结果（在result.valid中给出合法性） */
        bind : function(input_element, tip_element, validate_func, null_tip, invalid_tip) {
            var result = new Object();

            // 为input_element绑定blur事件
            $(input_element).blur(function() {
                var input_val = input_element.val();
                if (input_val == "") {
                    result.valid = false;
                    $(tip_element).html(null_tip);
                } else if (!validate_func(input_val)) {
                    result.valid = false;
                    $(tip_element).html(invalid_tip);
                } else {
                    result.valid = true;
                    $(tip_element).html("");
                }
            });

            return result;
        }
    }
});
