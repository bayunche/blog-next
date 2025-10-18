/**
 * 国际化 Provider
 * 提供 I18next 上下文，供应用内消费
 */

import { useEffect, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@shared/i18n/config'

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      document.documentElement.lang = lng
    }

    handleLanguageChange(i18n.language)
    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

export default I18nProvider
