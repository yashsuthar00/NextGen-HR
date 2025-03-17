import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Loader2, CheckCircle, AlertCircle, UserPlus, RefreshCw, Eye, EyeOff } from 'lucide-react';

function UserManagementSystem() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    department: '',
    role: 'employee', // Default role
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users'); 
      setUsers(response.data);
      console.log("response from usermanagement", response.data)
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generatePassword = () => {
    setIsGeneratingPassword(true);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setFormData({
      ...formData,
      password,
    });
    
    setTimeout(() => {
      setIsGeneratingPassword(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/users', formData);
      setSuccess(`Successfully created new ${formData.role} account for ${formData.fullname}`); 
      setFormData({
        username: '',
        fullname: '', 
        email: '',
        department: '',
        role: 'employee',
        password: '',
      });
      fetchUsers();
      
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
      setError('User already exists. Please try with a different email or username.');
      } else {
      setError('Failed to create user. Please try again.');
      }
      
      setTimeout(() => {
      setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">User Management System</h1>
          <p className="text-gray-600">Create and manage HR and employee accounts</p>
        </header>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="md:col-span-5 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Create New User
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
                <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullname">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname} 
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john.doe@company.com"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="department">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Engineering"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-24"
                    placeholder="••••••••"
                  />
                  <div className="absolute right-2 top-2 flex">
                    <button 
                      type="button" 
                      onClick={toggleShowPassword}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="ml-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center"
                    >
                      {isGeneratingPassword ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1" />
                      )}
                      Generate
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </button>
            </form>
          </div>
          
          {/* Users List Section */}
          <div className="md:col-span-7">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Users</h2>
                <button 
                  onClick={fetchUsers} 
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </button>
              </div>
              
              {loading && users.length === 0 ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <>
                  {users.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      No users found. Create your first user.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id || user._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{user.fullname}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{user.department}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === 'hr' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role.name === 'hr' ? 'HR' : 'Employee'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementSystem;