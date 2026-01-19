# 前端构建阶段
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --legacy-peer-deps

# 复制前端源码
COPY . .

# 构建生产版本
RUN npm run build

# ========================================
# Nginx 生产镜像
# ========================================
FROM nginx:alpine AS production

# 安装 nodejs 用于后端
RUN apk add --no-cache nodejs npm

WORKDIR /app

# 复制前端构建产物到 nginx
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# 复制后端代码
COPY server ./server

# 安装后端依赖
WORKDIR /app/server
RUN npm ci --production

# 复制 nginx 配置
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# 复制启动脚本
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
