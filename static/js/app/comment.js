define(['jquery', 'validator', 'common'],
function($, validator, common) { 
	// 为所有评论右侧的“回应”链接绑定click事件
	var comment_reply_click = function() {
		$("li.comment_item .reply a").click(function(event) {
			/* get some values from elements on the page: */
			$cur_body = $(this).closest(".head").siblings(".body");
			// 显示引用提示
			quote_tip = $(">p", $cur_body).html();
			$(".quote_tip").html('“  ' + quote_tip + '  ”');
			$(".quote_tip").show();
			// 设置引用id
			quote_id = $cur_body.closest(".comment_item").attr("id");
			$("#quote_id").val(quote_id)

			// 让textarea获取焦点
			setTimeout(function(){
				$("#last")[0].focus();
			}, 250);
		});
	};

    return {
        init: function() {
            // 主题的评论
            $("li.post_item .reply a").click(function(event) {
                // 隐藏引用提示
                $(".quote_tip").hide();
                // 无引用：quote_id为0
                $("#quote_id").val("0");

                // 让textarea获取焦点
                setTimeout(function(){
                    $("#last")[0].focus();
                }, 250);
            });

            // 评论的评论
            comment_reply_click();

            // 输入验证
            var comment =
            validator.bind($("form#new_comment #last"),
                           $("form#new_comment #last").next(),
                           function(val) {return true;},
                           "< 评论不能为空",
                           "");

            $("form#new_comment").submit(function(event) {
                // stop form from submitting normally
                event.preventDefault();

                /* 如果之前的焦点不在评论输入框，此时用户直接点击“回帖”按钮，就不会产生blur事件，进而无法对输入进行验证
                   因此为了适应不同场景，应该总是人为触发评论输入框的blur事件 */
                $("form#new_comment #last").blur();

                // 评论为空无法提交
                if (!comment.valid) {
                    return;
                }

                /* get some values from elements on the page: */
                var $form = $(this);
                var content = $form.find("#last").val();
                var quote_id = $("#quote_id", $form).val();
                //url = $form.attr("action");
                var url = window.location.href;

                /* Send the data using post */
                $.post(url, {content: content, quote_id: quote_id},
                    function(data) {
                        if (data.length == 0) {
                            alert("请登录后再评论");
                        } else {
							$.each(data, function(i, d) {
								$("ul#article_list").append(d.li);
							});
							// 因为在没有刷新页面的情况下，动态新增了评论，所以需要重新绑定click事件
							comment_reply_click();
                        }
                    }, "json");

                $(".quote_tip").hide();
                this.reset();
            });
        }
    }
});
