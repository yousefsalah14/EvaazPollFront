import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import evaazLogo from '../../assets/images/evaazlogo.webp'
import DarkmodeToggle from '../DarkmodeToggle/DarkmodeToggle'
import { useLanguage } from '../../contexts/LanguageContext'

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const { t, language, setLanguage } = useLanguage()
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-5 py-3">
        <Link to="/"><img src={evaazLogo} className="h-12" alt={t('logoAlt')} /></Link>
        <div className="flex items-center gap-3 md:order-2">
          <button type="button" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} lang={language === 'ar' ? 'en' : 'ar'} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary">{language === 'ar' ? 'English' : 'العربية'}</button>
          <DarkmodeToggle />
          <button type="button" onClick={() => setIsNavOpen(!isNavOpen)} aria-controls="navbar-links" aria-expanded={isNavOpen} aria-label={t('openMenu')} className="rounded-lg p-2 text-gray-600 md:hidden">
            <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 17 14"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" /></svg>
          </button>
        </div>
        <div id="navbar-links" className={(isNavOpen ? 'block' : 'hidden') + ' w-full md:order-1 md:block md:w-auto'}>
          <ul className="flex flex-col gap-5 py-3 md:flex-row md:gap-8 md:py-0">
            {[['/', 'home'], ['/form', 'registration']].map(([path, key]) => (
              <li key={path}><NavLink to={path} end onClick={() => setIsNavOpen(false)} className={({ isActive }) => isActive ? 'font-semibold text-primary' : 'text-gray-700 hover:text-primary dark:text-gray-300'}>{t(key)}</NavLink></li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
