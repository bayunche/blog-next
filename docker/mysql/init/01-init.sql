-- Sakurairo Blog 数据库初始化脚本
-- 字符集设置
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 使用数据库
USE sakurairo_blog;

-- 如果需要，可以在这里添加初始表结构
-- Sequelize 会自动创建表，但如果需要手动初始化可以在这里添加

-- 示例：创建管理员用户（密码需要在应用中创建）
-- INSERT INTO users (username, role, createdAt, updatedAt) VALUES ('admin', 1, NOW(), NOW());
