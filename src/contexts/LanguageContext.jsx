import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const messages = {
  ar: {
    home: 'الرئيسية', registration: 'التسجيل', dashboard: 'لوحة التحكم', logoAlt: 'شعار إيفاز',
    homeTitle: 'التسجيل في إيفاز هو خطوتكم الأولى نحو تطوير مدرستكم!',
    homeIntro: 'سجّل بيانات مدرستك أو فرعك وسنتواصل مع المشرف.', registerNow: 'سجّل الآن',
    registrationTitle: 'تسجيل المدرسة أو الفرع', formIntro: 'يرجى تعبئة الحقول الأربعة التالية. جميع الحقول مطلوبة.',
    schoolName: 'اسم المدرسة أو الفرع', supervisorName: 'اسم المشرف', phoneNumber: 'رقم الجوال', email: 'الإيميل',
    schoolRequired: 'اسم المدرسة أو الفرع مطلوب', supervisorRequired: 'اسم المشرف مطلوب',
    phoneRequired: 'رقم الجوال مطلوب', phoneInvalid: 'أدخل رقم جوال سعودي صحيحًا، مثل 05xxxxxxxx أو +9665xxxxxxxx',
    emailRequired: 'الإيميل مطلوب', emailInvalid: 'أدخل بريدًا إلكترونيًا صحيحًا',
    submit: 'إرسال', submitting: 'جارٍ الإرسال…', reset: 'إعادة تعيين',
    registrationSuccess: 'تم التسجيل بنجاح. شكرًا لتواصلكم مع إيفاز.',
    registrationError: 'تعذر إرسال التسجيل. يرجى المحاولة مرة أخرى.', alreadyRegistered: 'هذه المدرسة أو الفرع مسجلة بهذا الإيميل بالفعل.',
    loginTitle: 'دخول الأدمن', loginIntro: 'سجّل الدخول لعرض تسجيلات المدارس والفروع.', username: 'البريد الإلكتروني أو اسم المستخدم', password: 'كلمة المرور',
    usernameRequired: 'اسم المستخدم مطلوب', passwordRequired: 'كلمة المرور مطلوبة', login: 'تسجيل الدخول', loggingIn: 'جارٍ تسجيل الدخول…',
    loginError: 'اسم المستخدم أو كلمة المرور غير صحيحة.', connectionError: 'تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
    logout: 'تسجيل الخروج', registrationsTitle: 'تسجيلات المدارس والفروع', registrationsCount: 'عدد التسجيلات',
    search: 'البحث في التسجيلات', searchPlaceholder: 'ابحث باسم المدرسة أو المشرف أو الجوال أو الإيميل',
    refresh: 'تحديث', loading: 'جارٍ التحميل…', noRegistrations: 'لا توجد تسجيلات حتى الآن.', noMatches: 'لا توجد نتائج مطابقة لبحثك.',
    loadError: 'تعذر تحميل التسجيلات. يرجى إعادة المحاولة.', registeredAt: 'تاريخ التسجيل', light: 'فاتح', dark: 'داكن',
    theme: 'المظهر', openMenu: 'فتح القائمة',
    dashboardIntro: 'إدارة تسجيلات المدارس والفروع والبحث فيها وتصديرها من مكان واحد.',
    registrationStatistics: 'إحصائيات التسجيلات', registeredToday: 'تسجيلات اليوم', registeredThisMonth: 'تسجيلات هذا الشهر', filteredResults: 'النتائج المطابقة',
    manageRegistrations: 'إدارة التسجيلات', allSchools: 'كل المدارس والفروع', dateFrom: 'من تاريخ', dateTo: 'إلى تاريخ', clearFilters: 'مسح الفلاتر',
    sortBy: 'ترتيب حسب', sort_newest: 'الأحدث أولًا', sort_oldest: 'الأقدم أولًا', sort_name: 'اسم المدرسة', invalidDateRange: 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية أو مساويًا له.',
    exportExcel: 'تصدير إلى Excel', exporting: 'جارٍ التصدير…', exportHint: 'يشمل التصدير جميع النتائج المطابقة في كل الصفحات.', registrationsSheet: 'التسجيلات', exportError: 'تعذر تصدير الملف. يرجى المحاولة مرة أخرى.',
    addRegistration: 'إضافة تسجيل', editRegistration: 'تعديل التسجيل', registrationDetails: 'تفاصيل التسجيل', deleteRegistration: 'حذف التسجيل',
    actions: 'الإجراءات', view: 'عرض', edit: 'تعديل', delete: 'حذف', close: 'إغلاق', cancel: 'إلغاء', saveRegistration: 'حفظ التسجيل', saving: 'جارٍ الحفظ…',
    confirmDelete: 'حذف التسجيل نهائيًا', deleting: 'جارٍ الحذف…', deleteConfirmation: 'هل تريد حذف هذا التسجيل؟ لا يمكن التراجع عن هذا الإجراء.',
    recordCreated: 'تمت إضافة التسجيل بنجاح.', recordUpdated: 'تم تحديث التسجيل بنجاح.', recordDeleted: 'تم حذف التسجيل بنجاح.',
    saveError: 'تعذر حفظ التسجيل. يرجى المحاولة مرة أخرى.', deleteError: 'تعذر حذف التسجيل. يرجى المحاولة مرة أخرى.', recordMissing: 'هذا التسجيل لم يعد موجودًا. أغلق النافذة وحدّث القائمة.', fieldTooLong: 'الحد الأقصى 254 حرفًا.',
    showing: 'عرض', of: 'من', rowsPerPage: 'صفوف لكل صفحة', previous: 'السابق', next: 'التالي',
  },
  en: {
    home: 'Home', registration: 'Registration', dashboard: 'Dashboard', logoAlt: 'Evaaz logo',
    homeTitle: 'Your first step toward developing your school starts with Evaaz!',
    homeIntro: 'Register your school or branch details and we will contact the supervisor.', registerNow: 'Register now',
    registrationTitle: 'School or branch registration', formIntro: 'Please complete the four fields below. All fields are required.',
    schoolName: 'School or branch name', supervisorName: 'Supervisor name', phoneNumber: 'Mobile number', email: 'Email',
    schoolRequired: 'School or branch name is required', supervisorRequired: 'Supervisor name is required',
    phoneRequired: 'Mobile number is required', phoneInvalid: 'Enter a valid Saudi mobile number, such as 05xxxxxxxx or +9665xxxxxxxx',
    emailRequired: 'Email is required', emailInvalid: 'Enter a valid email address',
    submit: 'Submit', submitting: 'Submitting…', reset: 'Reset',
    registrationSuccess: 'Registration submitted successfully. Thank you for contacting Evaaz.',
    registrationError: 'Unable to submit your registration. Please try again.', alreadyRegistered: 'This school or branch is already registered with this email.',
    loginTitle: 'Admin login', loginIntro: 'Sign in to view school and branch registrations.', username: 'Email or username', password: 'Password',
    usernameRequired: 'Username is required', passwordRequired: 'Password is required', login: 'Sign in', loggingIn: 'Signing in…',
    loginError: 'Incorrect username or password.', connectionError: 'Unable to connect to the server. Please try again.',
    logout: 'Sign out', registrationsTitle: 'School and branch registrations', registrationsCount: 'Total registrations',
    search: 'Search registrations', searchPlaceholder: 'Search by school, supervisor, mobile number or email',
    refresh: 'Refresh', loading: 'Loading…', noRegistrations: 'No registrations yet.', noMatches: 'No registrations match your search.',
    loadError: 'Unable to load registrations. Please try again.', registeredAt: 'Registered on', light: 'Light', dark: 'Dark',
    theme: 'Theme', openMenu: 'Open menu',
    dashboardIntro: 'Manage, search and export school and branch registrations in one place.',
    registrationStatistics: 'Registration statistics', registeredToday: 'Registered today', registeredThisMonth: 'Registered this month', filteredResults: 'Matching results',
    manageRegistrations: 'Manage registrations', allSchools: 'All schools and branches', dateFrom: 'From date', dateTo: 'To date', clearFilters: 'Clear filters',
    sortBy: 'Sort by', sort_newest: 'Newest first', sort_oldest: 'Oldest first', sort_name: 'School name', invalidDateRange: 'The end date must be on or after the start date.',
    exportExcel: 'Export to Excel', exporting: 'Exporting…', exportHint: 'Export includes all matching results across every page.', registrationsSheet: 'Registrations', exportError: 'Unable to export the file. Please try again.',
    addRegistration: 'Add registration', editRegistration: 'Edit registration', registrationDetails: 'Registration details', deleteRegistration: 'Delete registration',
    actions: 'Actions', view: 'View', edit: 'Edit', delete: 'Delete', close: 'Close', cancel: 'Cancel', saveRegistration: 'Save registration', saving: 'Saving…',
    confirmDelete: 'Delete permanently', deleting: 'Deleting…', deleteConfirmation: 'Delete this registration? This action cannot be undone.',
    recordCreated: 'Registration added successfully.', recordUpdated: 'Registration updated successfully.', recordDeleted: 'Registration deleted successfully.',
    saveError: 'Unable to save the registration. Please try again.', deleteError: 'Unable to delete the registration. Please try again.', recordMissing: 'This registration no longer exists. Close this dialog and refresh the list.', fieldTooLong: 'Use no more than 254 characters.',
    showing: 'Showing', of: 'of', rowsPerPage: 'Rows per page', previous: 'Previous', next: 'Next',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('evaaz-language') === 'en' ? 'en' : 'ar')
  useEffect(() => {
    localStorage.setItem('evaaz-language', language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.title = language === 'ar' ? 'إيفاز | تسجيل المدارس' : 'Evaaz | School registration'
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage, t: (key) => messages[language][key] || key }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

LanguageProvider.propTypes = { children: PropTypes.node.isRequired }
