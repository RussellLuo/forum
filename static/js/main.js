// 全局配置
require.config({
    baseUrl: '/static/js',
    paths: {
        jquery: 'lib/jquery-1.10.1.min',
        validator: 'app/validator',
        common: 'app/common',
        register: 'app/register',
        login: 'app/login',
        comment: 'app/comment',
        setting: 'app/setting',
        password: 'app/password',
        profile: 'app/profile',
        new_post: 'app/new_post'
    }
});

require(['jquery', 'register', 'login', 'comment', 'setting', 'password', 'profile', 'new_post'],
function($, register, login, comment, setting, password, profile, new_post) {
    // 禁用cache
    $.ajaxSetup({
        cache : false
    });

    // $(document).ready(function() {...})
	$(function() {
		register.init();
		login.init();
		comment.init();
		setting.init();
		password.init();
		profile.init();
        new_post.init();
	});
});
