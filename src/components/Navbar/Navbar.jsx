import { Link, NavLink } from 'react-router-dom';
import evaazLogo from '../../assets/images/evaazlogo.webp'
import DarkmodeToggle from '../DarkmodeToggle/DarkmodeToggle';
import { useState } from 'react';

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-5 flex flex-wrap items-center justify-between p-3">
        <Link to="/" className="flex items-center space-x-3">
          <img src={evaazLogo} className="h-12" alt="Evaaz logo" />
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <DarkmodeToggle />
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isNavOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div className={`${isNavOpen ? "block" : "hidden"} w-full md:block md:w-auto md:order-1`} id="navbar-default">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <NavLink
                onClick={() => setIsNavOpen(false)}
                to="/"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded md:p-0 transition-colors duration-300 ${isActive ? "text-primary" : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"}`
                }
                end
              >
                الرئيسية
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => setIsNavOpen(false)}
                to="/form"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded md:p-0 transition-colors duration-300 ${isActive ? "text-primary" : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"}`
                }
              >
                التسجيل
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
