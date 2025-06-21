import { useState } from 'react'
import evaazLogo from '../../assets/images/evaazlogo.webp'
import axios from 'axios'
import { useFormik } from 'formik'
import { ThreeDots } from 'react-loader-spinner'
import { object, string, number, mixed } from 'yup'
import { motion } from 'framer-motion'

export default function Form() {
    const [apiError, setApiError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [commercialRegPreview, setCommercialRegPreview] = useState('')
    const [managerIdPreview, setManagerIdPreview] = useState('')

    const handleFileUpload = (e, fieldName, setPreview) => {
        const file = e.target.files[0]
        if (!file) return

        // Set the file in formik
        formik.setFieldValue(fieldName, file)

        // Preview file before upload
        const reader = new FileReader()
        reader.readAsDataURL(file)
        
        reader.onload = () => {
            setPreview(reader.result)
            console.log(`${fieldName} file selected:`, file.name, file.type, file.size)
        }
    }

    async function register(values) {
        setIsLoading(true)
        setApiError(null)
        setSuccessMsg(null)

        try {
            const formData = new FormData()
            
            // Add all form fields except files
            Object.entries(values).forEach(([key, value]) => {
                if (key !== 'commercialRegistration' && key !== 'contractManagerId') {
                    if (value !== null && value !== '') {
                        formData.append(key, value)
                    }
                }
            })

            // Add files if they exist
            if (values.commercialRegistration && values.commercialRegistration instanceof File) {
                formData.append('commercialRegistration', values.commercialRegistration)
                console.log('Added commercialRegistration file:', values.commercialRegistration.name)
            } else {
                console.log('No commercialRegistration file found')
            }
            
            if (values.contractManagerId && values.contractManagerId instanceof File) {
                formData.append('contractManagerId', values.contractManagerId)
                console.log('Added contractManagerId file:', values.contractManagerId.name)
            } else {
                console.log('No contractManagerId file found')
            }

            // Log FormData contents for debugging
            for (let [key, value] of formData.entries()) {
                console.log('FormData entry:', key, value instanceof File ? value.name : value)
            }

            const { data } = await axios.post(
                'https://evaaz-poll-hqzi.vercel.app/api/school/register',
                formData,
                { 
                    headers: { 
                        'Content-Type': 'multipart/form-data' 
                    },
                    timeout: 30000 // 30 second timeout
                }
            )

            setSuccessMsg(data.message)
            formik.resetForm()
            // Clear previews after successful submission
            setCommercialRegPreview('')
            setManagerIdPreview('')
        } catch (error) {
            console.error('Form submission error:', error)
            setApiError(error?.response?.data?.message || 'حدث خطأ ما')
        } finally {
            setIsLoading(false)
        }
    }

    const validationSchema = object({
        schoolName: string().required('اسم المدرسة مطلوب'),
        city: string().required('المدينة مطلوبة'),
        contractManagerName: string().required('اسم المسؤول مطلوب'),
        phoneNumber: string().matches(/^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/, 'رقم الجوال غير صحيح').required('رقم الجوال مطلوب'),
        email: string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
        kindergartenStudents: number().typeError('عدد الطلاب في الروضة يجب أن يكون رقم').required('مطلوب'),
        primary1to4Students: number().typeError('عدد الطلبة سنة اولى الى رابع ابتدائي يجب أن يكون رقم').required('مطلوب'),
        primary5to6Students: number().typeError('عدد الطلبة سنة خامس وسادس ابتدائي يجب أن يكون رقم').required('مطلوب'),
        intermediate1to2Students: number().typeError('عدد الطلبة سنة اولى وثاني متوسطة يجب أن يكون رقم').required('مطلوب'),
        intermediate3Students: number().typeError('عدد الطلبة سنة ثالث متوسطة يجب أن يكون رقم').required('مطلوب'),
        secondaryStudents: number().typeError('عدد الطلاب للمرحلة الثانوية يجب أن يكون رقم').required('مطلوب'),
        hasComputerLab: string().required('هذا الحقل مطلوب'),
        hasInternet: string().required('هذا الحقل مطلوب'),
        commercialRegistration: mixed().required('السجل التجاري مطلوب'),
        contractManagerId: mixed().required('هوية المسؤول مطلوبة'),
    })

    const formik = useFormik({
        initialValues: {
            schoolName: '',
            city: '',
            contractManagerName: '',
            phoneNumber: '',
            email: '',
            kindergartenStudents: '',
            primary1to4Students: '',
            primary5to6Students: '',
            intermediate1to2Students: '',
            intermediate3Students: '',
            secondaryStudents: '',
            hasComputerLab: '',
            hasInternet: '',
            commercialRegistration: '',
            contractManagerId: '',
        },
        onSubmit: register,
        validationSchema,
    })

    return (
        <div className="flex flex-col items-center justify-start w-full py-2" dir="rtl">
            <div className='flex flex-col items-center justify-center'>
                <img src={evaazLogo} className='w-80' alt="شعار إيفاز" />
                <h1 className="font-uni-sans-heavy text-primary dark:text-white text-3xl text-center mt-2">سجل الان</h1>
            </div>
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={formik.handleSubmit}
                className='bg-white dark:bg-gray-900 p-5 mt-4 rounded-xl shadow-xl w-full max-w-6xl'
                encType="multipart/form-data"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label htmlFor="schoolName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">اسم المدرسة</label>
                        <input type="text" id="schoolName" name="schoolName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.schoolName} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="اسم المدرسة" />
                        {formik.errors.schoolName && formik.touched.schoolName && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.schoolName}</div>}
                    </div>
                    <div>
                        <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">المدينة</label>
                        <input type="text" id="city" name="city" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.city} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="المدينة" />
                        {formik.errors.city && formik.touched.city && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.city}</div>}
                    </div>
                    <div>
                        <label htmlFor="contractManagerName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">اسم المسؤول عن التعاقد</label>
                        <input type="text" id="contractManagerName" name="contractManagerName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.contractManagerName} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="اسم المسؤول" />
                        {formik.errors.contractManagerName && formik.touched.contractManagerName && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.contractManagerName}</div>}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">رقم الجوال</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.phoneNumber} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="05xxxxxxxx" />
                        {formik.errors.phoneNumber && formik.touched.phoneNumber && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.phoneNumber}</div>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">الايميل</label>
                        <input type="email" id="email" name="email" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="example@email.com" />
                        {formik.errors.email && formik.touched.email && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.email}</div>}
                    </div>
                    <div>
                        <label htmlFor="hasComputerLab" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">هل توجد معامل حاسب آلي تغطي المراحل الدراسية ؟</label>
                        <select id="hasComputerLab" name="hasComputerLab" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.hasComputerLab} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="">اختر</option>
                            <option value="نعم">نعم</option>
                            <option value="لا">لا</option>
                        </select>
                        {formik.errors.hasComputerLab && formik.touched.hasComputerLab && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.hasComputerLab}</div>}
                    </div>
                    <div>
                        <label htmlFor="hasInternet" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">هل خدمة الانترنت متوفرة في معامل الحاسب الآلي؟</label>
                        <select id="hasInternet" name="hasInternet" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.hasInternet} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="">اختر</option>
                            <option value="نعم">نعم</option>
                            <option value="لا">لا</option>
                        </select>
                        {formik.errors.hasInternet && formik.touched.hasInternet && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.hasInternet}</div>}
                    </div>
                    {/* Title before student numbers */}
                    <div className="col-span-full">
                        <h5 className="font-bold text-[100px] text-gray-700 dark:!text-primary mb-2  sm:text-sm">
                            تعداد الطلبة حسب بيانات هذا العام الدراسي وذلك لتوفير عدد المدربين من افاز
                        </h5>
                    </div>
                    <div>
                        <label htmlFor="kindergartenStudents" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">عدد الطلاب في الروضة</label>
                        <input type="number" id="kindergartenStudents" name="kindergartenStudents" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.kindergartenStudents} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="عدد الطلاب في الروضة" />
                        {formik.errors.kindergartenStudents && formik.touched.kindergartenStudents && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.kindergartenStudents}</div>}
                    </div>
                    <div>
                        <label htmlFor="primary1to4Students" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">عدد الطلبة سنة اولى الى رابع ابتدائي</label>
                        <input type="number" id="primary1to4Students" name="primary1to4Students" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.primary1to4Students} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="عدد الطلبة سنة اولى الى رابع ابتدائي" />
                        {formik.errors.primary1to4Students && formik.touched.primary1to4Students && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.primary1to4Students}</div>}
                    </div>
                    <div>
                        <label htmlFor="primary5to6Students" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">عدد الطلبة سنة خامس وسادس ابتدائي</label>
                        <input type="number" id="primary5to6Students" name="primary5to6Students" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.primary5to6Students} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="عدد الطلبة سنة خامس وسادس ابتدائي" />
                        {formik.errors.primary5to6Students && formik.touched.primary5to6Students && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.primary5to6Students}</div>}
                    </div>
                    <div>
                        <label htmlFor="intermediate1to2Students" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">عدد الطلبة سنة اولى وثاني متوسطة</label>
                        <input type="number" id="intermediate1to2Students" name="intermediate1to2Students" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.intermediate1to2Students} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="عدد الطلبة سنة اولى وثاني متوسطة" />
                        {formik.errors.intermediate1to2Students && formik.touched.intermediate1to2Students && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.intermediate1to2Students}</div>}
                    </div>
                    <div>
                        <label htmlFor="intermediate3Students" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">عدد الطلبة سنة ثالث متوسطة</label>
                        <input type="number" id="intermediate3Students" name="intermediate3Students" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.intermediate3Students} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="عدد الطلبة سنة ثالث متوسطة" />
                        {formik.errors.intermediate3Students && formik.touched.intermediate3Students && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.intermediate3Students}</div>}
                    </div>
                    <div>
                        <label htmlFor="secondaryStudents" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">عدد الطلاب للمرحلة الثانوية</label>
                        <input type="number" id="secondaryStudents" name="secondaryStudents" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.secondaryStudents} className="focus:outline-primary bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="عدد الطلاب للمرحلة الثانوية" />
                        {formik.errors.secondaryStudents && formik.touched.secondaryStudents && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.secondaryStudents}</div>}
                    </div>

                    <div>
                        <label htmlFor="commercialRegistration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">السجل التجاري</label>
                        <input 
                            type="file" 
                            id="commercialRegistration" 
                            name="commercialRegistration" 
                            accept="image/png,image/jpeg,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onBlur={formik.handleBlur} 
                            onChange={e => handleFileUpload(e, 'commercialRegistration', setCommercialRegPreview)} 
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-primary" 
                        />
                        {commercialRegPreview && (
                            <div className="mt-2">
                                <p className="text-sm text-green-600">تم اختيار الملف بنجاح</p>
                                {commercialRegPreview.startsWith('data:image') && (
                                    <img src={commercialRegPreview} alt="معاينة السجل التجاري" className="mt-2 w-32 h-32 object-cover rounded border" />
                                )}
                            </div>
                        )}
                        {formik.errors.commercialRegistration && formik.touched.commercialRegistration && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.commercialRegistration}</div>}
                    </div>
                    <div>
                        <label htmlFor="contractManagerId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">هوية المسؤول عن التعاقد</label>
                        <input 
                            type="file" 
                            id="contractManagerId" 
                            name="contractManagerId" 
                            accept="image/png,image/jpeg,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onBlur={formik.handleBlur} 
                            onChange={e => handleFileUpload(e, 'contractManagerId', setManagerIdPreview)} 
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-primary" 
                        />
                        {managerIdPreview && (
                            <div className="mt-2">
                                <p className="text-sm text-green-600">تم اختيار الملف بنجاح</p>
                                {managerIdPreview.startsWith('data:image') && (
                                    <img src={managerIdPreview} alt="معاينة هوية المسؤول" className="mt-2 w-32 h-32 object-cover rounded border" />
                                )}
                            </div>
                        )}
                        {formik.errors.contractManagerId && formik.touched.contractManagerId && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{formik.errors.contractManagerId}</div>}
                    </div>
                </div>
                {apiError && <div className="px-4 py-3 my-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{apiError}</div>}
                {successMsg && <div className="px-4 py-3 my-2 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">{successMsg}</div>}
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="mt-5 flex justify-start items-center space-x-3">
                    <button type="submit" disabled={isLoading} className={`text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 transition-all flex items-center justify-center`}>
                        {isLoading ? (<ThreeDots visible={true} height="20" width="43" color="white" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="w-fit m-auto" />) : "إرسال"}
                    </button>
                    <button type="button" onClick={() => { formik.resetForm(); setApiError(null); setSuccessMsg(null); }} className='text-primary ring-primary ring-2 ring-inset px-5 py-2.5 transition-all text-sm rounded-lg'>إعادة تعيين</button>
                </motion.div>
            </motion.form>
        </div>
    )
}
