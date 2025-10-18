import zhCNCommon from './zh-CN/common'
import zhCNLayout from './zh-CN/layout'
import zhCNArticle from './zh-CN/article'
import zhCNAbout from './zh-CN/about'
import zhCNAuth from './zh-CN/auth'
import enUSCommon from './en-US/common'
import enUSLayout from './en-US/layout'
import enUSArticle from './en-US/article'
import enUSAbout from './en-US/about'
import enUSAuth from './en-US/auth'

export const resources = {
  'zh-CN': {
    common: zhCNCommon,
    layout: zhCNLayout,
    article: zhCNArticle,
    about: zhCNAbout,
    auth: zhCNAuth,
  },
  'en-US': {
    common: enUSCommon,
    layout: enUSLayout,
    article: enUSArticle,
    about: enUSAbout,
    auth: enUSAuth,
  },
}

export type SupportedLanguage = keyof typeof resources

export const supportedLanguages = Object.keys(resources) as SupportedLanguage[]
