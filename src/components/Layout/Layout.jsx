import { Outlet } from 'react-router-dom'
import Navbar from './../Navbar/Navbar';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-base-color dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}
