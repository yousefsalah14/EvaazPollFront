import { useState } from 'react'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

export default function Login() {
  const { t } = useLanguage()
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [errorKey, setErrorKey] = useState(null)
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: object({ username: string().trim().required('usernameRequired'), password: string().required('passwordRequired') }),
    onSubmit: async ({ username, password }) => {
      setErrorKey(null)
      try {
        await login(username.trim(), password)
        navigate('/dashboard', { replace: true })
      } catch (error) {
        setErrorKey(error.response?.status === 401 ? 'loginError' : 'connectionError')
      }
    },
  })

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-3 text-3xl font-bold text-primary">{t('loginTitle')}</h1>
      <p className="mb-7 text-gray-600 dark:text-gray-300">{t('loginIntro')}</p>
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-6 rounded-xl bg-white p-7 shadow-xl dark:bg-gray-900">
        {['username', 'password'].map((name) => (
          <div key={name}>
            <label htmlFor={name} className="mb-2 block font-semibold">{t(name)}</label>
            <input id={name} name={name} type={name === 'password' ? 'password' : 'text'} autoComplete={name === 'password' ? 'current-password' : 'username'} dir="ltr" required value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={formik.touched[name] && Boolean(formik.errors[name]) || undefined} aria-describedby={formik.touched[name] && formik.errors[name] ? name + '-error' : undefined} className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-primary" />
            {formik.touched[name] && formik.errors[name] && <p id={name + '-error'} role="alert" className="mt-2 text-sm text-red-700">{t(formik.errors[name])}</p>}
          </div>
        ))}
        {errorKey && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{t(errorKey)}</p>}
        <button disabled={formik.isSubmitting} type="submit" className="w-full rounded-lg bg-primary px-6 py-3 font-bold text-white hover:bg-secondary disabled:opacity-60">{t(formik.isSubmitting ? 'loggingIn' : 'login')}</button>
      </form>
    </main>
  )
}
