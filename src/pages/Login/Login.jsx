import { useFormik } from 'formik';
import { object, string } from 'yup';
import logo from '../../assets/images/evaazlogo.webp';
import { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to /schools if already authenticated or token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!loading && (isAuthenticated || token)) {
      navigate('/schools', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  async function handleLogin(values) {
    setIsLoading(true);
    setApiError(null);
    try {
      const { data } = await axios.post('https://evaaz-poll-hqzi.vercel.app/api/auth/login', values);
      
      const token = data.results?.token;

      // Save token and user data
      if (token) {
        login(data.results.user || data.results, token);
        console.log('Login response:', data);
        console.log('Navigating to /schools...');
      } else {
        setApiError('لم يتم استلام رمز المصادقة أو أن بنية الاستجابة غير متوقعة');
      }
    } catch (error) {
      setApiError(error?.response?.data?.message || 'حدث خطأ ما');
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = object({
    username: string('اسم المستخدم غير صحيح').required('اسم المستخدم مطلوب'),
    password: string().required('كلمة المرور مطلوبة'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className="bg-base-color dark:bg-gray-900 flex justify-center items-center py-8 min-h-[80vh]">
      <div className="w-full flex flex-col items-center justify-center space-y-5 ">
        <div className="w-20">
          <img className="w-full" src={logo} loading="lazy" alt="Evaaz logo" />
        </div>
        <form onSubmit={formik.handleSubmit} className="w-4/5 lg:w-1/4 p-8 bg-white shadow-xl rounded-lg">
          <div className="text-center text-gray-800 font-bold tracking-wider text-2xl mb-5">تسجيل الدخول</div>
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">اسم المستخدم</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none "
              placeholder="example@evaaz.com"
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="mt-2 text-sm text-red-500">{formik.errors.username}</div>
            ) : null}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 ">كلمة المرور</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
              placeholder="•••••••••"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="mt-2 text-sm text-red-500">{formik.errors.password}</div>
            ) : null}
          </div>
          {apiError && <div className="mb-4 text-sm text-red-500 text-center">{apiError}</div>}
          <div className="w-fit m-auto">
            <button type="submit" disabled={isLoading} className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              {isLoading ? (
                <ThreeDots visible={true} height="20" width="43" color="white" radius="9" ariaLabel="three-dots-loading" />
              ) : (
                'دخول'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
