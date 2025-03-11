import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-xl font-bold cursor-pointer">RBAC System</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative group">
                  <button className="flex items-center space-x-1">
                    <span>{user?.name || user?.email}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded shadow-lg py-1 invisible group-hover:visible">
                    <Link href="/dashboard">
                      <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Dashboard</span>
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="hover:underline cursor-pointer">Login</span>
                </Link>
                <Link href="/register">
                  <span className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 cursor-pointer">Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;