import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

export default function DarkmodeToggle() {
  const { t } = useLanguage()
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') === 'dark' ? 'dark' : 'light')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  return <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={t('theme') + ': ' + t(theme === 'dark' ? 'light' : 'dark')} className="rounded-md p-2 text-gray-600 dark:text-white">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
}
