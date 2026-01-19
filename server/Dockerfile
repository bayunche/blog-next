FROM node:20-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装生产依赖
RUN npm ci --production

# 复制源码
COPY . .

# 设置环境变量
ENV NODE_ENV=production

EXPOSE 6060

CMD ["node", "app.js"]
