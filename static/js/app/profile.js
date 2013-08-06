define(['jquery', 'validator', 'common'],
function($, validator, common) { 
    return {
        init: function() {

            $("form#master_profile").submit(function(event) {
                var filepath = $("input#mypic").val(); 

                /*----- 本次提交中含有图片 -----*/
                if (filepath != "") {
                    /*----- 限制图片格式 -----*/
                    // 该方法参考http://www.cnblogs.com/davidhhuan/archive/2012/02/29/2373467.html
                    var extStart = filepath.lastIndexOf("."); 
                    var ext = filepath.substring(extStart, filepath.length).toUpperCase(); 
                    if(ext != ".BMP" && ext!=".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") { 
                        // stop form from submitting normally
                        event.preventDefault();

                        alert("图片限于bmp,png,gif,jpeg,jpg格式"); 
                        return;
                    } 

                    /*----- 限制图片大小 -----*/
                    // 该方法参考http://www.cnblogs.com/davidhhuan/archive/2012/02/29/2373467.html
                    var filesize_limit = 10 * 1024; // 10k
                    var filesize = 0;
                    // jQuery1.9移除了$.brower，以下替代方法参考http://www.fwolf.com/blog/post/35
                    //if ($.browser.msie) {
                    if (/msie/.test(navigator.userAgent.toLowerCase())) {
                        // for IE
                        var img = new Image(); 
                        img.src = filepath;   
                        filesize = img.filesize;
                    }
                    else {
                        // for Firefox,Chrome
                        filesize = $("input#mypic")[0].files.item(0).size;
                    }

                    if(filesize > filesize_limit) {       
                        // stop form from submitting normally
                        event.preventDefault();

                        alert("图片不大于10K"); 
                    }
                }

                // 对简介不做检查，直接提交
            });
        }
    }
});
