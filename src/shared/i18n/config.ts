import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { resources, supportedLanguages, type SupportedLanguage } from './locales'

export const defaultNamespace = 'common'
export const supportedNamespaces = ['common', 'layout', 'article', 'about', 'auth'] as const

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNamespace
    resources: (typeof resources)['zh-CN']
  }
}

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'zh-CN',
      supportedLngs: supportedLanguages,
      defaultNS: defaultNamespace,
      ns: supportedNamespaces,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'blog-next-lang',
      },
    })
}

export const changeLanguage = (lng: SupportedLanguage) => {
  if (supportedLanguages.includes(lng)) {
    return i18n.changeLanguage(lng)
  }
  return i18n.changeLanguage('zh-CN')
}

export default i18n
