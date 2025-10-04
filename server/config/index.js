const toNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toBoolean = (value, fallback) => {
  if (typeof value === 'boolean') {
    return value
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['1', 'true', 'yes', 'on'].includes(normalized)) {
      return true
    }
    if (['0', 'false', 'no', 'off'].includes(normalized)) {
      return false
    }
  }
  return fallback
}

const config = {
  PORT: toNumber(process.env.SERVER_PORT || process.env.PORT, 6060),
  ADMIN_GITHUB_LOGIN_NAME: process.env.ADMIN_GITHUB_LOGIN_NAME || 'your_github_username',
  GITHUB: {
    client_id: process.env.GITHUB_CLIENT_ID || 'your_github_client_id',
    client_secret: process.env.GITHUB_CLIENT_SECRET || 'your_github_client_secret',
    access_token_url: process.env.GITHUB_ACCESS_TOKEN_URL || 'https://github.com/login/oauth/authorize',
    fetch_user_url: process.env.GITHUB_FETCH_USER_URL || 'https://api.github.com/user',
    fetch_user: process.env.GITHUB_FETCH_USER_URL || 'https://api.github.com/user'
  },
  EMAIL_NOTICE: {
    enable: toBoolean(process.env.EMAIL_NOTICE_ENABLE, true),
    transporterConfig: {
      host: process.env.EMAIL_NOTICE_HOST || 'smtp.qq.com',
      port: toNumber(process.env.EMAIL_NOTICE_PORT, 465),
      secure: toBoolean(process.env.EMAIL_NOTICE_SECURE, true),
      auth: {
        user: process.env.EMAIL_NOTICE_USER || 'your_email@example.com',
        pass: process.env.EMAIL_NOTICE_PASS || 'your_email_authorization_code'
      }
    },
    subject: process.env.EMAIL_NOTICE_SUBJECT || '���վ�� - ������ۻ���µĻظ�',
    text: process.env.EMAIL_NOTICE_TEXT || '������ۻ���µĻظ�',
    WEB_HOST: process.env.EMAIL_NOTICE_WEB_HOST || 'http://www.hasunemiku.top'
  },
  TOKEN: {
    secret: process.env.TOKEN_SECRET || 'root',
    expiresIn: process.env.TOKEN_EXPIRES_IN || '720h'
  },
  DATABASE: {
    database: process.env.MYSQL_DATABASE || 'test',
    user: process.env.MYSQL_USER || 'testuser',
    password: process.env.MYSQL_PASSWORD || '12345678',
    options: {
      host: process.env.MYSQL_HOST || 'mysql',
      port: toNumber(process.env.MYSQL_PORT, 3306),
      dialect: process.env.DB_DIALECT || 'mysql',
      pool: {
        max: toNumber(process.env.MYSQL_POOL_MAX, 5),
        min: toNumber(process.env.MYSQL_POOL_MIN, 0),
        acquire: toNumber(process.env.MYSQL_POOL_ACQUIRE, 30000),
        idle: toNumber(process.env.MYSQL_POOL_IDLE, 10000)
      },
      define: {
        timestamps: toBoolean(process.env.SEQUELIZE_TIMESTAMPS, false),
        freezeTableName: toBoolean(process.env.SEQUELIZE_FREEZE_TABLE_NAME, true)
      },
      timezone: process.env.DB_TIMEZONE || '+08:00'
    }
  },
  IMAGE_BED: {
    type: process.env.IMAGE_BED_TYPE || 'chevereto', // 图床类型
    chevereto: {
      url: process.env.CHEVERETO_URL || 'https://your-image-bed.com', // Chevereto 图床地址
      apiKey: process.env.CHEVERETO_API_KEY || 'chv_bPwj_eec3a36e7656692b6d806898473764553cc51c01ce1a8be22b54a51f786e6c9b87103d48044a7f07e58d7f7ef51a81e0daff963fa1e0361073357e29917b8d30',
      uploadEndpoint: '/api/1/upload' // API 端点
    }
  }
}

module.exports = config
