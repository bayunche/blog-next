/**
 * 语言切换 Hook
 * 封装 i18next 语言获取与切换逻辑
 */

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from '@shared/i18n/config'
import { supportedLanguages, type SupportedLanguage } from '@shared/i18n/locales'

export function useLanguage() {
  const { i18n } = useTranslation()

  const setLanguage = useCallback((lng: SupportedLanguage) => {
    changeLanguage(lng)
  }, [])

  return {
    language: i18n.language,
    supportedLanguages,
    setLanguage,
  }
}

export default useLanguage
