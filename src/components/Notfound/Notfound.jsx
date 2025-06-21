import React from 'react'
import notfound from '../../assets/images/404 error with person looking for.gif'
import { Link } from 'react-router-dom'

export default function Notfound() {
    return (
        <div className="flex flex-col justify-center items-center text-center py-10">
            <img src={notfound} alt="404 Not Found" className="w-1/2" />
            <h1 className="text-3xl font-bold text-primary my-4">Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                to="/"
                className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-secondary transition-colors"
            >
                Go to Homepage
            </Link>
        </div>
    )
}
