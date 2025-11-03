import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@shared/hooks'
import type { SupportedLanguage } from '@shared/i18n/locales'

const NAV_ITEMS = [
  { path: '/', labelKey: 'nav.home', exact: true },
  { path: '/archives', labelKey: 'nav.archives' },
  { path: '/tags', labelKey: 'nav.tags' },
  { path: '/about', labelKey: 'nav.about' },
  { path: '/fragment', labelKey: 'nav.fragment' },
]

const CONTACT_EMAIL = 'bayunche@gmail.com'

export function WebHeader() {
  const location = useLocation()
  const { t: tLayout } = useTranslation('layout')
  const { t: tCommon } = useTranslation('common')
  const { language, setLanguage, supportedLanguages } = useLanguage()

  const activePath = useMemo(() => {
    const exactItem = NAV_ITEMS.find((item) => item.exact && location.pathname === item.path)
    if (exactItem) return exactItem.path
    const fuzzyItem = NAV_ITEMS.filter((item) => !item.exact).find((item) =>
      location.pathname.startsWith(item.path)
    )
    return fuzzyItem?.path ?? ''
  }, [location.pathname])

  const isArticleDetail =
    location.pathname.startsWith('/article/') || location.pathname.startsWith('/posts/')

  return (
    <header className="web-header__inner" role="banner">
      <div className="web-header__brandBlock">
        <div className="web-header__brandTitle">{tCommon('app.title')}</div>
        <div className="web-header__brandTagline">{tLayout('header.tagline')}</div>
        <div className="web-header__brandMeta">
          <span className="web-header__brandEmail">{CONTACT_EMAIL}</span>
          {!isArticleDetail && (
            <Select
              value={language as SupportedLanguage}
              onChange={(value) => setLanguage(value as SupportedLanguage)}
              options={supportedLanguages.map((lng) => ({
                value: lng,
                label: tCommon(`languages.${lng}` as const),
              }))}
              size="small"
              className="web-header__language"
              bordered={false}
            />
          )}
        </div>
      </div>

      <nav className="web-header__nav" aria-label={tLayout('nav.openMenu')}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              ['web-header__navItem', isActive || activePath === item.path ? 'is-active' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            {tLayout(item.labelKey)}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default WebHeader
