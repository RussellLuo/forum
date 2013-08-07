#!/usr/bin/python
# -*- coding: utf-8 -*-
import web
import settings
import model
import util
import os
import json
import hashlib
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

urls = (
  '/', 'Index',
  '/add', 'Add',
  '/edit/(\d+)', 'Edit',
  '/del/(\d+)', 'Del',
  '/view/(\d+)', 'View',
  '/register', 'Register',
  '/login', 'Login',
  '/logout', 'Logout',
  '/user/(\d+)', 'Profile',
  '/account/(\w+)', 'Account',
  '/password', 'Password',
  '/about', 'About')

app = web.application(urls, globals(), autoreload=True)
# custom notfound and internalerror
#app.notfound = lambda: web.notfound("404 Not Found")
#app.internalerror = lambda: web.internalerror("500 Internal Server Error")

##### BEG: 模板渲染 #####
curdir = os.path.abspath(os.path.dirname(__file__))
templates = curdir + '/templates/'
def render(params={}, partial=False):
    global_vars = dict(settings.GLOBAL_PARAMS.items() + params.items())
    
    if partial:
        return web.template.render(templates, globals=global_vars)
    else:
        return web.template.render(templates, base='layout', globals=global_vars)

def titled_render(subtitle=''):
    subtitle = subtitle + ' - ' if subtitle else ''
    return render({'title': subtitle + settings.SITE_NAME, 'make_html': util.make_html,
                   'trim_utf8': util.trim_utf8, 'menu': util.menu(model.User())})
##### END: 模板渲染 #####


class Index:
    def GET(self):
        i = web.input(page='1')
        page = int(i.page)
        page_posts, page_count = model.Post().list(page)
        return titled_render().list(page_posts, page_count, page)

class Add:
    def GET(self):
        if model.User().current_id(): # 用户已登录
            return titled_render('发帖').add()
        else:
            return titled_render().failed('操作受限，请先<a href="/login">登录</a>')

    def POST(self):
        i = web.input(title='', content='')
        post_id = model.Post().new(i.title, i.content, model.User().current_id())
        if post_id:
            raise web.seeother("/view/%d" % post_id)
        else:
            return titled_render().failed('你不应该到达这里')

class Edit:
    def GET(self, post_id):
        post_id = int(post_id)
        cur_user_id = model.User().current_id()
        post = model.Post().view(post_id)
        # 只有作者（已登录）才能编辑自己的文章
        if post and post['user_id'] == cur_user_id:
            return titled_render().edit(post)
        elif cur_user_id: # 用户已登录，但不是作者
            return titled_render().failed('操作受限，你无权编辑其他人的文章')
        else: # 用户未登录
            return titled_render().failed('操作受限，请先<a href="/login">登录</a>')

    def POST(self, post_id):
        i = web.input(title='', content='')
        post_id = int(post_id)
        if model.Post().update(post_id, i.title, i.content):
            raise web.seeother("/view/%d" % post_id)
        else:
            return titled_render().failed('你不应该到达这里')

class Del:
    def GET(self, post_id):
        post_id = int(post_id)
        cur_user_id = model.User().current_id()
        post = model.Post().view(post_id)
        # 只有作者（已登录）才能删除自己的文章
        if post and post['user_id'] == cur_user_id:
            # 删除文章的同时也会删除相关的所有评论
            model.Comment(post_id).ddel()
            model.Post().ddel(post_id)
            raise web.seeother('/account/posts')
        elif cur_user_id: # 用户已登录，但不是作者
            return titled_render().failed('操作受限，你无权删除其他人的文章')
        else: # 用户未登录
            return titled_render().failed('操作受限，请先<a href="/login">登录</a>')

class View:
    def GET(self, post_id):
        post_id = int(post_id)
        post = model.Post().view(post_id)
        if post:
            comment = model.Comment(int(post_id))
            comments = comment.quote(comment.list())
            comment_lis = util.comments_to_lis(comments)
            return titled_render(post.title).view(post, comment_lis)
        else:
            raise web.seeother('/')

    def POST(self, post_id):
        # jQuery+Ajax实现无刷新回帖
        i = web.input()
        cur_user_id = model.User().current_id()
        web.header('Content-Type', 'application/json')
        if cur_user_id:
            comment = model.Comment(int(post_id))
            # 回帖成功：返回"回帖"+"引用贴"信息
            if comment.new(i.content, cur_user_id, i.quote_id):
                comments = comment.quote([comment.last()])
                return json.dumps(util.comments_to_lis(comments))
        # 无权限：返回空
        return json.dumps([])

class Register:
    def GET(self):
        return titled_render('注册').register()

    def POST(self):
        try:
            i = web.input()
            user_id = model.User().new(i.email, i.username, i.password)
        except Exception, e:
            return titled_render().failed('邮箱或帐号已存在，请重新<a href="/register">注册</a>')
        else:
            if user_id:
                # 设置cookie
                web.setcookie('user_id', str(user_id), settings.COOKIE_EXPIRES)
                raise web.seeother('/user/%d' % user_id)

class Login:
    def GET(self):
        return titled_render('登录').login()

    def POST(self):
        i = web.input(username='', password='')
        user_id = model.User().login(i.username, i.password)
        if user_id:
            # 设置cookie
            web.setcookie('user_id', str(user_id), settings.COOKIE_EXPIRES)
            raise web.seeother('/user/%d' % user_id)
        else:
            return titled_render().failed('登录验证失败，请检查帐号和密码是否正确')

class Logout:
    def GET(self):
        if model.User().current_id(): # 用户已登录
            # 取消cookie
            web.setcookie('user_id', '', -1)
        raise web.seeother('/')

class Profile:
    def GET(self, user_id):
        user_id = int(user_id)
        status = model.User().status(user_id)
        if status['username']:
            if user_id == model.User().current_id():
                return titled_render(status['username']).master_profile(status['username'], status['picture'], status['description'])
            else:
                return titled_render(status['username']).user_profile(status['username'], status['picture'], status['description'])
        else:
            raise web.notfound()

    def POST(self, user_id):
        # 获取当前登录用户的状态
        user_id = int(user_id)
        user = model.User()
        status = user.status(user_id)
        # 将头像和简介
        i = web.input(mypic={}, description='')
        if 'mypic' in i:
            filepath = i.mypic.filename.replace('\\','/') # 将Windows风格的斜杠转换为Linux风格
            filename = filepath.split('/')[-1] # 文件名（带后缀）
            ext = filename.split('.')[-1] # 扩展名
            # 扩展名不为空时才更新头像
            if ext:
                # 网站主页的相对路径
                rel_filename = settings.IMG_DIR + '/' + str(user_id) + '_head.' + ext
                # 服务器上的绝对路径
                abs_filename = curdir + '/' + rel_filename
                # 1.更新头像路径和简介
                if user.update(user_id, picture=rel_filename):
                    # 2.更新数据库成功后，保存头像
                    fout = open(abs_filename, 'w')
                    fout.write(i.mypic.file.read())
                    fout.close()
            # 对简介不做检查，直接更新
            user.update(user_id, description=i.description)
        raise web.seeother('/user/%d' % user_id)

class Account:
    def GET(self, part):
        # 获取当前登录用户的状态
        cur_user_id = model.User().current_id()
        status = model.User().status(cur_user_id)

        # 已登录用户才能进行账户管理
        if cur_user_id:
            dispatch = {'posts': titled_render('文章').account_posts(model.Post().digest_list(cur_user_id)),
                        'settings': titled_render('设置').account_settings(status['username'],
                                    status['picture'], status['description'], status['email'])}
            if part in dispatch:
                return dispatch[part]
            else: # 无法访问
                raise web.notfound()

        # 用户未登录
        return titled_render().failed('操作受限，请先<a href="/login">登录</a>')

    def POST(self, part):
        # 获取当前登录用户的状态
        user = model.User()
        cur_user_id = user.current_id()
        status = user.status(cur_user_id)
        i = web.input(email='', password='')
        web.header('Content-Type', 'application/json')
        if cur_user_id:
            # 修改成功
            if user.update(cur_user_id, email=i.email, password=i.password):
                return json.dumps({'result': True})
        # 修改失败
        return json.dumps({'result': False})

class Password:
    def GET(self):
        return titled_render('密码').password()

    def POST(self):
        i = web.input(email='')
        web.header('Content-Type', 'application/json')
        user = model.User()
        user_id = user.matched_id(email=i.email)
        if user_id:
            status = user.status(user_id) # 获取当前状态
            temp_password = status['password_hash'][0:8] # 使用原来密码的“MD5值前8位”作为临时密码
            # 发送邮件
            subject = '请尽快修改您的密码——来自论坛网站'
            message = '''尊敬的%s：
                             您的临时密码是"%s"，请用该密码登录后，尽快修改密码，谢谢！
                      ''' % (status['username'], temp_password)
            try:
                web.sendmail(settings.SITE_SMTP_USERNAME, i.email, subject, message)
            except Exception, e: # 发送失败
                print e
            else: # 发送成功
                if user.update(user_id, password=temp_password): # 设置临时密码
                    return json.dumps({'result': True})
        # 邮箱未注册
        return json.dumps({'result': False})

class About:
    def GET(self):
        return titled_render().about()

# 导出的wsgi函数
application = app.wsgifunc()

##### 调试 #####
if __name__ == "__main__":
    app.run()
