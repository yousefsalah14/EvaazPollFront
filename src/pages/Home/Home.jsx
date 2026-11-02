import { NavLink } from 'react-router-dom'
import writingImage from '../../assets/images/Writing room-pana.png'
import { useLanguage } from '../../contexts/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  return (
    <main className="container mx-auto flex items-center justify-center p-4 py-10">
      <div className="flex w-full flex-col-reverse items-center gap-8 rounded-xl bg-white p-8 shadow-2xl dark:bg-gray-800 md:flex-row">
        <div className="flex flex-col items-center justify-center text-center md:w-1/2">
          <h1 className="mb-6 text-2xl font-bold text-primary dark:text-yellow-300">{t('homeTitle')}</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-200">{t('homeIntro')}</p>
          <NavLink to="/form" className="inline-block rounded-lg bg-primary px-10 py-3 font-bold text-white transition-colors hover:bg-secondary">{t('registerNow')}</NavLink>
        </div>
        <div className="flex items-center justify-center md:w-1/2">
          <img src={writingImage} alt="" className="h-auto max-w-full" />
        </div>
      </div>
    </main>
  )
}
