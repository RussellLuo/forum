-- 配置MySQL连接为utf-8
SET NAMES 'utf8';
SET CHARSET 'utf8';

-- 创建数据库
CREATE DATABASE IF NOT EXISTS forum DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
USE forum;

-- 创建表users
CREATE TABLE IF NOT EXISTS users
(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    picture TEXT NOT NULL,
    description TEXT,
    time TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(id),
    UNIQUE KEY(email),
    UNIQUE KEY(name)
);

-- 创建表posts
CREATE TABLE IF NOT EXISTS posts
(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    time TIMESTAMP DEFAULT NOW(),
    user_id INT UNSIGNED,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- 创建表comments
CREATE TABLE IF NOT EXISTS comments
(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    time TIMESTAMP DEFAULT NOW(),
    user_id INT UNSIGNED,
    parent_id INT UNSIGNED,
    quote_id INT UNSIGNED,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(parent_id) REFERENCES posts(id),
    FOREIGN KEY(quote_id) REFERENCES comments(id)
);

-- 设置时区为北京时间
-- 1.以下命令仅在当前会话期间有效
/*SET time_zone = '+8:00';*/
-- 2.以下命令则全局有效
SET GLOBAL time_zone = '+8:00';
