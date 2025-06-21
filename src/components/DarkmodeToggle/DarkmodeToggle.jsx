import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const DarkmodeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsDropdownOpen(false);
  };

  const themeIcons = {
    light: <Sun size={18} />,
    dark: <Moon size={18} />,
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="p-2 bg-transparent text-gray-600 dark:text-white rounded-md"
      >
        {themeIcons[theme]}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-1 w-fit bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex items-center p-2 w-full text-gray-700 dark:text-gray-200 ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          >
            <Sun size={18} className="mr-2" /> Light
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex items-center p-2 w-full text-gray-700 dark:text-gray-200 ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          >
            <Moon size={18} className="mr-2" /> Dark
          </button>
        </div>
      )}
    </div>
  );
};

export default DarkmodeToggle;
