import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { FaSearch, FaSchool, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaSignOutAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Schools() {
  const { logout } = useAuth();
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  
  // Search form state
  const [searchForm, setSearchForm] = useState({
    schoolName: '',
    city: '',
    contractManagerName: '',
    phoneNumber: '',
    email: ''
  });

  const handleApiError = (err) => {
    if (err.response?.status === 401) {
      logout();
    } else {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    const fetchAllSchools = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          logout();
          return;
        }

        const response = await axios.get('https://evaaz-poll-hqzi.vercel.app/api/school/allschools', {
          headers: { token },
        });

        console.log("All Schools API Response:", response.data); // For debugging
        
        // Safely extract the array of schools
        const schoolsData = response.data.المدارس || response.data.schools || (Array.isArray(response.data) ? response.data : []);
        
        setSchools(schoolsData);
        setFilteredSchools(schoolsData);
        
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSchools();
  }, [logout]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Check if at least one search field is filled
    const hasSearchCriteria = Object.values(searchForm).some(value => value.trim() !== '');
    if (!hasSearchCriteria) {
      setError('يرجى إدخال معيار بحث واحد على الأقل');
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      setSearchMode(true);
      
      // Remove empty fields from search params
      const searchParams = Object.fromEntries(
        Object.entries(searchForm).filter(([, value]) => value.trim() !== '')
      );
      
      const token = localStorage.getItem('userToken');
      const response = await axios.get('https://evaaz-poll-hqzi.vercel.app/api/school/search', {
        params: searchParams,
        headers: { token },
      });

      console.log("Search API Response:", response.data); // For debugging

      // Safely extract the array of schools from the search response
      const searchData = response.data.المدارس || response.data.schools || [];
      setFilteredSchools(searchData);
    } catch (err) {
      if (err.response?.status === 404) {
        setFilteredSchools([]);
        setError('لا يوجد نتائج مطابقة');
      } else {
        handleApiError(err);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReset = () => {
    setSearchForm({
      schoolName: '',
      city: '',
      contractManagerName: '',
      phoneNumber: '',
      email: ''
    });
    setSearchMode(false);
    setFilteredSchools(schools);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    logout();
  };

  const isFacilityAvailable = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lowerCaseValue = value.trim().toLowerCase();
      return lowerCaseValue === 'true' || lowerCaseValue === 'نعم';
    }
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <ThreeDots visible={true} height="80" width="80" color="#3B82F6" radius="9" ariaLabel="three-dots-loading" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">جاري تحميل المدارس...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <FaSchool className="text-3xl text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المدارس</h1>
                <p className="text-gray-600 dark:text-gray-300">عرض وإدارة جميع المدارس المسجلة</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 space-x-reverse bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 space-x-reverse mb-6">
            <FaSearch className="text-xl text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">البحث في المدارس</h2>
          </div>
          
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم المدرسة
              </label>
              <input
                type="text"
                name="schoolName"
                value={searchForm.schoolName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="أدخل اسم المدرسة"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المدينة
              </label>
              <input
                type="text"
                name="city"
                value={searchForm.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="أدخل المدينة"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم مدير العقد
              </label>
              <input
                type="text"
                name="contractManagerName"
                value={searchForm.contractManagerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="أدخل اسم مدير العقد"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رقم الهاتف
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={searchForm.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="أدخل رقم الهاتف"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={searchForm.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
            
            <div className="flex items-end space-x-3 space-x-reverse">
              <button
                type="submit"
                disabled={searchLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {searchLoading ? (
                  <ThreeDots visible={true} height="20" width="40" color="white" radius="9" />
                ) : (
                  'بحث'
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                إعادة تعيين
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-300 text-center">{error}</p>
          </div>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {searchMode ? 'نتائج البحث' : 'جميع المدارس'}
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredSchools.length} مدرسة
          </span>
        </div>

        {/* Schools Grid */}
        {filteredSchools.length === 0 ? (
          <div className="text-center py-12">
            <FaSchool className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              لا توجد مدارس
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchMode ? 'لا توجد نتائج مطابقة لمعايير البحث' : 'لم يتم العثور على مدارس مسجلة'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchools.map((school) => {
              return(
                <div
                  key={school._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1"
                >
                  <div className="p-6 flex-grow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <FaSchool className="text-3xl text-blue-600" />
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                          {school.schoolName || 'اسم المدرسة غير متوفر'}
                        </h4>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                      <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm">معلومات التواصل</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2 space-x-reverse"><FaMapMarkerAlt className="text-gray-400" /> <span>{school.city || '-'}</span></div>
                        <div className="flex items-center space-x-2 space-x-reverse"><FaUser className="text-gray-400" /> <span>{school.contractManagerName || '-'}</span></div>
                        <div className="flex items-center space-x-2 space-x-reverse"><FaPhone className="text-gray-400" /> <span>{school.phoneNumber || '-'}</span></div>
                        <div className="flex items-center space-x-2 space-x-reverse"><FaEnvelope className="text-gray-400" /> <span className="truncate">{school.email || '-'}</span></div>
                        {/* Mobile-only questions */}
                        <div className="block sm:hidden col-span-1 mt-2 text-right text-xs text-gray-700 dark:text-gray-200">
                          <div>هل يتوفر خدمة الانترنت لمعامل الحاسب؟</div>
                          <div>هل يتوفر معمل حاسب لكل مرحلة؟</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Student Counts */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                      <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm">
                        تعداد الطلبة حسب بيانات هذا العام الدراسي وذلك لتوفير عدد المدربين من افاز
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="p-2 bg-gray-50 dark:bg-gray-700/80 rounded-lg text-center"><div className="font-bold text-base text-gray-800 dark:text-white">{school.kindergartenStudents ?? 0}</div><div>روضة</div></div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-700/80 rounded-lg text-center"><div className="font-bold text-base text-gray-800 dark:text-white">{school.primary1to4Students ?? 0}</div><div>ابتدائي (1-4)</div></div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-700/80 rounded-lg text-center"><div className="font-bold text-base text-gray-800 dark:text-white">{school.primary5to6Students ?? 0}</div><div>ابتدائي (5-6)</div></div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-700/80 rounded-lg text-center"><div className="font-bold text-base text-gray-800 dark:text-white">{school.intermediate1to2Students ?? 0}</div><div>متوسط (1-2)</div></div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-700/80 rounded-lg text-center"><div className="font-bold text-base text-gray-800 dark:text-white">{school.intermediate3Students ?? 0}</div><div>متوسط (3)</div></div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-700/80 rounded-lg text-center"><div className="font-bold text-base text-gray-800 dark:text-white">{school.secondaryStudents ?? 0}</div><div>ثانوي</div></div>
                      </div>
                    </div>
                    
                    {/* Facilities & Documents */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">المرافق</h5>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 space-x-reverse">{isFacilityAvailable(school.hasComputerLab) ? <FaCheckCircle className="text-green-500"/> : <FaTimesCircle className="text-red-500"/>} <span className='dark:text-gray-300'>معمل حاسب آلي</span></div>
                            <div className="flex items-center space-x-2 space-x-reverse">{isFacilityAvailable(school.hasInternet) ? <FaCheckCircle className="text-green-500"/> : <FaTimesCircle className="text-red-500"/>} <span className='dark:text-gray-300'>انترنت</span></div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">المستندات</h5>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                            <a 
                              href={school.commercialRegistration?.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex-1 text-center bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                            >
                              السجل التجاري
                            </a>
                            <a 
                              href={school.contractManagerId?.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex-1 text-center bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                            >
                              هوية المدير
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Timestamps */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-2 text-xs text-gray-500 dark:text-gray-400 mt-auto">
                    <div className="flex justify-between items-center">
                      <span>أنشئ: {new Date(school.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>آخر تحديث: {new Date(school.updatedAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
} 