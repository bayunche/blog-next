import zhCNCommon from './zh-CN/common'
import zhCNLayout from './zh-CN/layout'
import zhCNArticle from './zh-CN/article'
import zhCNAbout from './zh-CN/about'
import zhCNAuth from './zh-CN/auth'
import zhCNHome from './zh-CN/home'
import enUSCommon from './en-US/common'
import enUSLayout from './en-US/layout'
import enUSArticle from './en-US/article'
import enUSAbout from './en-US/about'
import enUSAuth from './en-US/auth'
import enUSHome from './en-US/home'
import zhTWCommon from './zh-TW/common'
import zhTWLayout from './zh-TW/layout'
import zhTWArticle from './zh-TW/article'
import zhTWAbout from './zh-TW/about'
import zhTWAuth from './zh-TW/auth'
import zhTWHome from './zh-TW/home'

export const resources = {
  'zh-CN': {
    common: zhCNCommon,
    layout: zhCNLayout,
    article: zhCNArticle,
    about: zhCNAbout,
    auth: zhCNAuth,
    home: zhCNHome,
  },
  'en-US': {
    common: enUSCommon,
    layout: enUSLayout,
    article: enUSArticle,
    about: enUSAbout,
    auth: enUSAuth,
    home: enUSHome,
  },
  'zh-TW': {
    common: zhTWCommon,
    layout: zhTWLayout,
    article: zhTWArticle,
    about: zhTWAbout,
    auth: zhTWAuth,
    home: zhTWHome,
  },
}

export type SupportedLanguage = keyof typeof resources

export const supportedLanguages = Object.keys(resources) as SupportedLanguage[]
