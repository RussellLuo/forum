define(['jquery'],
function($) {
    return {
        // 合法的邮件
        email_pattern : /^([.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,

        // 合法的密码
        username_pattern : /^[a-zA-Z][a-zA-Z0-9_]{1,19}$/,

        // 合法的密码
        passwd_pattern : /^.*$/,

        // jQuery1.9中移除了原来的toggle(fn1, fn2, ...)方法, 这里使用别人提供的替代品
        // 参考: http://ithelp.ithome.com.tw/question/10116057或http://stackoverflow.com/questions/14338078/equivalent-of-deprecated-jquery-toggle-event
        toggleClick : function() {
            var functions = arguments ;  
          
            return this.click(function(){  
                    var iteration = $(this).data('iteration') || 0;  
                    functions[iteration].apply(this, arguments);  
                    iteration = (iteration + 1) % functions.length ;  
                    $(this).data('iteration', iteration);  
            });  
        }
    }
});
