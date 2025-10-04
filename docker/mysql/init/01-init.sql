-- 初始化脚本示例
-- 这个文件会在 MySQL 容器首次启动时自动执行

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 注意：数据库已经在容器启动时通过环境变量创建
-- 这里只需要创建表结构（如果需要）

-- 示例：创建用户表（实际表结构由 Sequelize 自动创建）
-- CREATE TABLE IF NOT EXISTS `users` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `username` varchar(255) NOT NULL,
--   `email` varchar(255) DEFAULT NULL,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
