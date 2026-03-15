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
  MUSIC_API_URL: process.env.MUSIC_API_URL || 'http://localhost:3000',
  ADMIN_GITHUB_LOGIN_NAME: process.env.ADMIN_GITHUB_LOGIN_NAME || '',
  GITHUB: {
    client_id: process.env.GITHUB_CLIENT_ID || '',
    client_secret: process.env.GITHUB_CLIENT_SECRET || '',
    redirect_uri: process.env.GITHUB_REDIRECT_URI || '',
    access_token_url: process.env.GITHUB_ACCESS_TOKEN_URL || 'https://github.com/login/oauth/access_token',
    fetch_user_url: process.env.GITHUB_FETCH_USER_URL || 'https://api.github.com/user',
    fetch_user_emails_url: process.env.GITHUB_FETCH_USER_EMAILS_URL || 'https://api.github.com/user/emails',
    fetch_user: process.env.GITHUB_FETCH_USER_URL || 'https://api.github.com/user',
  },
  EMAIL_NOTICE: {
    enable: toBoolean(process.env.EMAIL_NOTICE_ENABLE, true),
    transporterConfig: {
      host: process.env.EMAIL_NOTICE_HOST || 'smtp.qq.com',
      port: toNumber(process.env.EMAIL_NOTICE_PORT, 465),
      secure: toBoolean(process.env.EMAIL_NOTICE_SECURE, true),
      auth: {
        user: process.env.EMAIL_NOTICE_USER || 'your_email@example.com',
        pass: process.env.EMAIL_NOTICE_PASS || 'your_email_authorization_code',
      },
    },
    subject: process.env.EMAIL_NOTICE_SUBJECT || '评论通知 - 您收到了一条新的回复',
    text: process.env.EMAIL_NOTICE_TEXT || '您收到了一条新的回复',
    WEB_HOST: process.env.EMAIL_NOTICE_WEB_HOST || 'http://www.hasunemiku.top',
  },
  TOKEN: {
    secret: process.env.TOKEN_SECRET || 'root',
    expiresIn: process.env.TOKEN_EXPIRES_IN || '720h',
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
        idle: toNumber(process.env.MYSQL_POOL_IDLE, 10000),
      },
      define: {
        timestamps: toBoolean(process.env.SEQUELIZE_TIMESTAMPS, false),
        freezeTableName: toBoolean(process.env.SEQUELIZE_FREEZE_TABLE_NAME, true),
      },
      timezone: process.env.DB_TIMEZONE || '+08:00',
    },
  },
  IMAGE_BED: {
    type: process.env.IMAGE_BED_TYPE || 'chevereto',
    publicUrl: process.env.IMAGE_BED_PUBLIC_URL || process.env.NEXT_PUBLIC_IMAGE_BED_URL || process.env.CHEVERETO_URL || '',
    chevereto: {
      url: process.env.CHEVERETO_URL || '',
      apiKey: process.env.CHEVERETO_API_KEY || '',
      uploadEndpoint: process.env.CHEVERETO_UPLOAD_ENDPOINT || '/api/1/upload',
    },
    picui: {
      apiUrl: process.env.PICUI_API_URL || 'https://picui.cn/api/v1',
      token: process.env.PICUI_TOKEN || '',
      strategyId: process.env.PICUI_STRATEGY_ID || '',
      permission: process.env.PICUI_PERMISSION || '',
      albumId: process.env.PICUI_ALBUM_ID || '',
      expiredAt: process.env.PICUI_EXPIRED_AT || '',
    },
  },
}

module.exports = config
