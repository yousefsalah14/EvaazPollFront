import { useFormik } from 'formik';
import { object, string } from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function Contactus() {
    const [apiError, setApiError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    async function contact(values) {
        setIsLoading(true);
        setApiError(null);
        setSuccessMsg(null);
        try {
            // Replace with your actual contact API endpoint
            const { data } = await axios.post('https://api.example.com/contact', values);
            setSuccessMsg(data.message || 'Your message has been sent successfully!');
            formik.resetForm();
        } catch (error) {
            setApiError(error?.response?.data?.message || 'An error occurred while sending your message.');
        } finally {
            setIsLoading(false);
        }
    }

    const validationSchema = object({
        name: string().required('Name is required'),
        email: string().email('Invalid email address').required('Email is required'),
        message: string().required('Message is required'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            message: '',
        },
        validationSchema,
        onSubmit: contact,
    });

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-primary dark:text-white text-center mb-8">Contact Us</h1>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Your Name"
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="mt-2 text-sm text-red-600">{formik.errors.name}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="your.email@example.com"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="mt-2 text-sm text-red-600">{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={4}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.message}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Your message..."
                        />
                        {formik.touched.message && formik.errors.message ? (
                            <div className="mt-2 text-sm text-red-600">{formik.errors.message}</div>
                        ) : null}
                    </div>
                    {apiError && <div className="text-sm text-red-600 text-center">{apiError}</div>}
                    {successMsg && <div className="text-sm text-green-600 text-center">{successMsg}</div>}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            {isLoading ? (
                                <ThreeDots visible={true} height="20" width="43" color="white" radius="9" />
                            ) : (
                                'Send Message'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
