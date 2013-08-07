define(['jquery', 'cleditor'],
function($, validator, common) { 
    return {
        init: function() {
            // 将add.html和edit.html中的textarea输入框转换为cleditor富文本编辑框
            $("form#new_post textarea#content").cleditor({width: 850, height: 500});
        }
    }
});
