import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions';

const Sidebar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      permission: null, // Everyone can access
    },
    {
      title: 'Interviews',
      path: '/interviews',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      ),
      permission: 'VIEW_INTERVIEWS',
    },
    {
      title: 'New Interview',
      path: '/interviews/new',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ),
      permission: 'CREATE_INTERVIEW',
    },
    {
      title: 'User Management',
      path: '/users',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      permission: 'MANAGE_USERS',
    },
  ];

  return (
    <div className="fixed h-full w-64 bg-gray-800 text-white shadow-lg">
      <div className="p-4">
        <div className="text-center mb-6">
          <div className="text-xl font-bold mt-2">{user?.role?.toUpperCase()}</div>
        </div>
        
        <ul>
          {menuItems.map((item) => {
            // Skip rendering if user doesn't have permission
            if (item.permission && !hasPermission(user, item.permission)) {
              return null;
            }
            
            const isActive = router.pathname === item.path || router.pathname.startsWith(`${item.path}/`);
            
            return (
              <li key={item.title} className="mb-1">
                <Link href={item.path}>
                  <span className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}>
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;