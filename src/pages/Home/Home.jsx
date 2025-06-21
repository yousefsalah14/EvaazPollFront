import { NavLink } from 'react-router-dom';
import writingImage from '../../assets/images/Writing room-pana.png';

export default function Home() {
    return (
        <div className="container mx-auto p-4 flex items-center justify-center">
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 flex flex-col-reverse md:flex-row gap-8 items-center">
                {/* Text and Button Column */}
                <div className="flex flex-col items-center justify-center text-center" dir="rtl">
                    <h1 className="text-2xl font-bold text-primary dark:text-yellow-300 mb-6">
                        التسجيل في Evaaz هو خطوتكم الأولى نحو تطوير مدرستكم!
                    </h1>
                    <p className="mb-6 text-gray-600 dark:text-gray-200">
                        للوصول إلى استمارة التسجيل، يرجى الضغط على الزر أدناه.
                    </p>
                    <NavLink
                        to="/form"
                        className="inline-block bg-primary hover:bg-secondary text-white font-bold py-3 px-10 rounded-lg transition-colors duration-300 transform hover:scale-105"
                    >
                        سجل الآن
                    </NavLink>
                </div>

                {/* Image Column */}
                <div className="flex justify-center items-center">
                    <img src={writingImage} alt="Person working at a desk" className="max-w-full h-auto" />
                </div>
            </div>
        </div>
    );
}
