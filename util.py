#!/usr/bin/python
# -*- coding: utf-8 -*-
import web
import markdown

def make_html(c):
    return markdown.markdown(c)

def trim_utf8(text, length):
    '''utf8字符截取'''
    extra_flag = '...' if length < len(text.decode('utf-8')) else ''
    return text.decode('utf-8')[0:length].encode('utf-8') + extra_flag

def comments_to_lis(comments):
    '''评论列表'''
    lis = []
    for c in comments:
        li_start = '<li class="clearfix comment_item" id="%d">' % c['id']
        user_face= '''<div class="user_face">
                          <a href="/user/%d"><img src="%s" alt="%s"/></a>
                      </div>''' % (c['user_id'], c['user_face'], c['username'])
        content_start = '<div class="content">'
        content_head = '''<div class="head">
                             <span class="username"><a href="/user/%d">%s</a></span>
                             <span class="time">%s</span>
                             <span class="reply"><a href="#last">回应</a></span>
                             <span class="floor"><a href="#first">top</a></span>
                         </div>''' % (c['user_id'], c['username'], c['time'])
        content_quote = ''
        if c['quote_content']:
            content_quote = '<div class="quote"><p><b>引用</b>  <a href="/user/%d">%s</a><b>：</b></p><p>%s</p></div>' \
                            % (c['quote_user_id'], c['quote_username'], c['quote_content'])
        content_body = '<div class="body"><p>%s</p></div>' % c['content']
        content_end = '</div>'
        li_end = '</li>'

        lis.append({'li': li_start + user_face + content_start + content_head +
                          content_quote + content_body + content_end + li_end})

    return lis

def menu(user):
    '''导航菜单'''
    cur_user_id = user.current_id()
    if cur_user_id:
        status = user.status(cur_user_id)
        return [{'link': '/user/%d' % cur_user_id, 'name': status['username']},
                {'link': '/account/posts', 'name': '文章'},
                {'link': '/account/settings', 'name': '设置'},
                {'link': '/logout', 'name': '退出'}]
    else:
        return [{'link': '/login', 'name': '登录'},
                {'link': '/register', 'name': '注册'}]
